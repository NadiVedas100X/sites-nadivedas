import {env} from "cloudflare:workers";
import {recordFunnelEvent} from "../../analytics/route";
import {sendVerifiedMetaPurchase} from "../../../lib/meta-conversions";
import {paypalAccessToken,paypalBase,type PayPalRuntime} from "../../../lib/paypal";
import {sendTikTokServerEvent} from "../../../lib/tiktok-events";
import {getRequestExecutionContext} from "vinext/shims/request-context";
import {syncLeadToCrm} from "../../../lib/crm";

const journeyUrl=(request:Request,leadId:string,success:boolean)=>{const url=new URL("/journey",request.url);url.searchParams.set("payment",success?"success":"failed");if(leadId)url.searchParams.set("lead",leadId);return url};

export async function GET(request:Request){
  const runtime=env as unknown as PayPalRuntime&{DB:D1Database},url=new URL(request.url),leadId=url.searchParams.get("lead")||"",orderId=url.searchParams.get("token")||"";
  if(!leadId||!orderId)return Response.redirect(journeyUrl(request,leadId,false),303);
  type Lead={id:string;name:string;email:string;whatsapp:string;visitor_id:string;selected_nadi:string|null;payment_txnid:string|null;payment_status:string|null;payment_amount:number|null;payment_currency:string|null;pricing_rate:number|null;meta_fbp:string|null;meta_fbc:string|null;client_user_agent:string|null;tiktok_ttp:string|null;tiktok_ttclid:string|null;client_ip:string|null};
  const lead=await runtime.DB.prepare("SELECT id,name,email,whatsapp,visitor_id,selected_nadi,payment_txnid,payment_status,payment_amount,payment_currency,pricing_rate,meta_fbp,meta_fbc,client_user_agent,tiktok_ttp,tiktok_ttclid,client_ip FROM leads WHERE id=?").bind(leadId).first<Lead>();
  if(!lead||lead.payment_txnid!==orderId)return Response.redirect(journeyUrl(request,leadId,false),303);
  if(lead.payment_status==="success")return Response.redirect(journeyUrl(request,leadId,true),303);
  try{
    const access=await paypalAccessToken(runtime),response=await fetch(`${paypalBase(runtime)}/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,{method:"POST",headers:{Authorization:`Bearer ${access}`,"Content-Type":"application/json","PayPal-Request-Id":`capture-${orderId}`},body:"{}"});
    const captured=await response.json() as {status?:string;purchase_units?:Array<{custom_id?:string;payments?:{captures?:Array<{id?:string;status?:string;amount?:{currency_code?:string;value?:string}}>}}>};
    const unit=captured.purchase_units?.[0],capture=unit?.payments?.captures?.[0],amount=Number(capture?.amount?.value),currency=capture?.amount?.currency_code||"";
    const verified=response.ok&&captured.status==="COMPLETED"&&capture?.status==="COMPLETED"&&unit?.custom_id===lead.id&&currency===lead.payment_currency&&Math.abs(amount-Number(lead.payment_amount))<0.001;
    if(!verified){
      await runtime.DB.prepare("UPDATE leads SET payment_status='failed',status='payment_failed' WHERE id=? AND payment_status!='success'").bind(lead.id).run();
      getRequestExecutionContext()?.waitUntil(syncLeadToCrm({sourceLeadId:lead.id,visitorId:lead.visitor_id,name:lead.name,email:lead.email,whatsapp:lead.whatsapp,selectedNadi:lead.selected_nadi||"",paymentStatus:"failed",paymentAmount:Number(lead.payment_amount)||0,paymentCurrency:lead.payment_currency||currency||"USD",paymentTxnid:orderId,paymentProvider:"PayPal",stage:"lf_payment_failed"}).catch(error=>({ok:false,error:String(error)})));
      return Response.redirect(journeyUrl(request,leadId,false),303);
    }
    await runtime.DB.prepare("UPDATE leads SET payment_status='success',status='paid',payment_amount=?,payment_currency=? WHERE id=?").bind(amount,currency,lead.id).run();
    if(lead.visitor_id)await recordFunnelEvent("payment_success",lead.visitor_id,lead.id);
    const metaResult=await sendVerifiedMetaPurchase({transactionId:capture?.id||orderId,leadId:lead.id,amount:String(amount),currency,email:lead.email,phone:lead.whatsapp,firstName:lead.name.trim().split(/\s+/)[0]||"",sourceUrl:new URL("/journey",request.url).toString(),fbp:lead.meta_fbp||"",fbc:lead.meta_fbc||"",clientUserAgent:lead.client_user_agent||""});
    console.info("Meta Purchase delivery",{leadId,transactionId:capture?.id||orderId,...metaResult});
    const nadi=lead.selected_nadi||"",context=getRequestExecutionContext();context?.waitUntil(sendTikTokServerEvent({event:"Purchase",eventId:`purchase-${lead.id}`,leadId:lead.id,amount,currency,rateFromInr:Number(lead.pricing_rate)||1,contentId:nadi?`${nadi}-nadi-leaf-finding`:"nadi-leaf-finding",contentName:nadi?`${nadi} Nadi Leaf Finding`:"NadiVedas Leaf Finding",email:lead.email,phone:lead.whatsapp,sourceUrl:new URL(`/journey${nadi?`/${nadi}-nadi`:""}`,request.url).toString(),clientIp:lead.client_ip||"",clientUserAgent:lead.client_user_agent||"",ttclid:lead.tiktok_ttclid||"",ttp:lead.tiktok_ttp||""}).then(result=>console.info("TikTok PayPal Purchase delivery",{leadId,orderId,transactionId:capture?.id||orderId,...result})));context?.waitUntil(syncLeadToCrm({sourceLeadId:lead.id,visitorId:lead.visitor_id,name:lead.name,email:lead.email,whatsapp:lead.whatsapp,selectedNadi:nadi,paymentStatus:"success",paymentAmount:amount,paymentCurrency:currency,paymentTxnid:capture?.id||orderId,paymentProvider:"PayPal",stage:"lf_paid"}).then(result=>runtime.DB.prepare("UPDATE leads SET crm_synced=?,crm_error=? WHERE id=?").bind(result.ok?1:0,result.error||null,lead.id).run()));
    return Response.redirect(journeyUrl(request,leadId,true),303);
  }catch(error){console.error("PayPal capture failed",{leadId,orderId,error:String(error)});return Response.redirect(journeyUrl(request,leadId,false),303)}
}
