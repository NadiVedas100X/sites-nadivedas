import {env} from "cloudflare:workers";
import {recordFunnelEvent} from "../../analytics/route";
import {leafFindingAmount,type PricingProfile} from "../../../lib/pricing";
import {pricingForRequest} from "../../../lib/server-pricing";
import {paypalAccessToken,paypalBase,type PayPalRuntime} from "../../../lib/paypal";
import {sendTikTokServerEvent} from "../../../lib/tiktok-events";
import {getRequestExecutionContext} from "vinext/shims/request-context";
import {syncLeadToCrm} from "../../../lib/crm";

export async function POST(request:Request){
  const runtime=env as unknown as PayPalRuntime&{DB:D1Database};
  const data=await request.formData().catch(()=>null),leadId=String(data?.get("leadId")||"");
  if(!leadId)return new Response("Missing booking reference",{status:400});
  type Lead={id:string;name:string;email?:string;whatsapp?:string;visitor_id:string;selected_nadi:string|null;pricing_country?:string|null;pricing_region?:PricingProfile["region"]|null;pricing_currency?:PricingProfile["currency"]|null;pricing_rate?:number|null;pricing_multiplier?:number|null;leaf_finding_amount?:number|null;offer_expires_at?:number|null;tiktok_ttp?:string|null;tiktok_ttclid?:string|null;client_ip?:string|null;client_user_agent?:string|null};
  let lead=await runtime.DB.prepare("SELECT id,name,email,whatsapp,visitor_id,selected_nadi,pricing_country,pricing_region,pricing_currency,pricing_rate,pricing_multiplier,leaf_finding_amount,offer_expires_at,tiktok_ttp,tiktok_ttclid,client_ip,client_user_agent FROM leads WHERE id=?").bind(leadId).first<Lead>().catch(()=>null);
  if(!lead)lead=await runtime.DB.prepare("SELECT id,name,email,whatsapp,visitor_id,selected_nadi FROM leads WHERE id=?").bind(leadId).first<Lead>();
  if(!lead)return new Response("Booking reference not found",{status:404});
  const current=await pricingForRequest(request),offerValid=Number(lead.offer_expires_at)>Date.now(),pricing:PricingProfile=lead.pricing_currency&&lead.pricing_region?{country:lead.pricing_country||current.country,region:lead.pricing_region,currency:lead.pricing_currency,rateFromInr:Number(lead.pricing_rate)||current.rateFromInr,nadiMultiplier:Number(lead.pricing_multiplier)||current.nadiMultiplier,leafFinding:offerValid?Number(lead.leaf_finding_amount)||current.leafFinding:current.leafFinding,updatedAt:current.updatedAt}:current;
  if(pricing.region==="india")return Response.redirect(new URL("/journey?payment=failed&reason=provider",request.url),303);
  if(!runtime.PAYPAL_CLIENT_ID||!runtime.PAYPAL_CLIENT_SECRET)return new Response("PayPal checkout is being connected. Please contact NadiVedas support.",{status:503});
  const nadiNames:Record<string,string>={shiva:"Shiva Nadi",brahma:"Brahma Nadi",nandi:"Nandi Nadi",kaka:"Kakabhushundi Nadi",vasishta:"Vasishta Nadi",thirumoolar:"Thirumoolar Nadi",bhogar:"Bhogar Nadi",dhanvantari:"Dhanvantari Nadi",shukra:"Shukra Nadi",bhrigu:"Bhrigu Nadi",atri:"Atri Nadi",agastya:"Agastya Nadi"};
  const amount=leafFindingAmount(pricing,lead.selected_nadi||"").toFixed(2),origin=new URL(request.url).origin,token=await paypalAccessToken(runtime),requestId=`${lead.id}-${crypto.randomUUID()}`;
  const response=await fetch(`${paypalBase(runtime)}/v2/checkout/orders`,{method:"POST",headers:{Authorization:`Bearer ${token}`,"Content-Type":"application/json","PayPal-Request-Id":requestId},body:JSON.stringify({intent:"CAPTURE",purchase_units:[{custom_id:lead.id,description:lead.selected_nadi?`${nadiNames[lead.selected_nadi]||"Nadi"} Leaf Finding`:"NadiVedas Leaf Finding",amount:{currency_code:pricing.currency,value:amount}}],payment_source:{paypal:{experience_context:{brand_name:"NadiVedas",shipping_preference:"NO_SHIPPING",user_action:"PAY_NOW",return_url:`${origin}/api/paypal/callback?lead=${encodeURIComponent(lead.id)}`,cancel_url:`${origin}/journey?payment=cancelled&lead=${encodeURIComponent(lead.id)}`}}}})});
  const order=await response.json() as {id?:string;links?:Array<{rel:string;href:string}>;message?:string};
  if(!response.ok||!order.id)return new Response(order.message||"PayPal could not open checkout",{status:502});
  const approval=order.links?.find(link=>link.rel==="payer-action"||link.rel==="approve")?.href;
  if(!approval)return new Response("PayPal approval link was not returned",{status:502});
  await runtime.DB.prepare("UPDATE leads SET payment_txnid=?,payment_status='initiated',payment_amount=?,payment_currency=? WHERE id=?").bind(order.id,Number(amount),pricing.currency,lead.id).run();
  getRequestExecutionContext()?.waitUntil(syncLeadToCrm({sourceLeadId:lead.id,visitorId:lead.visitor_id,name:lead.name,email:lead.email||"",whatsapp:lead.whatsapp||"",selectedNadi:lead.selected_nadi||"",paymentStatus:"initiated",paymentAmount:Number(amount),paymentCurrency:pricing.currency,paymentTxnid:order.id,paymentProvider:"PayPal",stage:"lf_payment_pending"}).catch(error=>({ok:false,error:String(error)})));
  if(lead.visitor_id)await recordFunnelEvent("payment_started",lead.visitor_id,lead.id);
  getRequestExecutionContext()?.waitUntil(sendTikTokServerEvent({event:"InitiateCheckout",eventId:`checkout-${lead.id}`,leadId:lead.id,amount:Number(amount),currency:pricing.currency,rateFromInr:pricing.rateFromInr,contentId:lead.selected_nadi?`${lead.selected_nadi}-nadi-leaf-finding`:"nadi-leaf-finding",contentName:lead.selected_nadi?`${nadiNames[lead.selected_nadi]||"Nadi"} Leaf Finding`:"NadiVedas Leaf Finding",email:lead.email||"",phone:lead.whatsapp||"",sourceUrl:new URL(`/journey${lead.selected_nadi?`/${lead.selected_nadi}-nadi`:""}`,request.url).toString(),clientIp:lead.client_ip||"",clientUserAgent:lead.client_user_agent||"",ttclid:lead.tiktok_ttclid||"",ttp:lead.tiktok_ttp||""}).then(result=>console.info("TikTok PayPal InitiateCheckout delivery",{leadId:lead.id,orderId:order.id,...result})));
  return Response.redirect(approval,303);
}
