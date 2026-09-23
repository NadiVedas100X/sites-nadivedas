import { env } from "cloudflare:workers";
import {recordFunnelEvent} from "../../analytics/route";
import {sendVerifiedMetaPurchase} from "../../../lib/meta-conversions";
import {sendTikTokServerEvent} from "../../../lib/tiktok-events";
import {getRequestExecutionContext} from "vinext/shims/request-context";
import {syncLeadToCrm} from "../../../lib/crm";
import {isInternalTestIdentity} from "../../../lib/tracking-exclusions";

const hex=(buffer:ArrayBuffer)=>Array.from(new Uint8Array(buffer)).map(b=>b.toString(16).padStart(2,"0")).join("");

function normalizePayuStatus(value:string) {
  const status=String(value||"").trim().toLowerCase();
  if(status==="success")return "success";
  if(status==="failure"||status==="failed")return "failed";
  if(status==="pending")return "pending";
  if(status==="refund"||status==="refunded"||status==="chargeback"||status==="chargeback_reversed"||status==="reversed")return "refunded";
  return status || "unknown";
}

function isRefundStatus(status:string){
  return status==="refunded";
}

export async function POST(request:Request){
  const runtime=env as unknown as {DB:D1Database;PAYU_SALT?:string};
  const form=await request.formData();
  const get=(k:string)=>String(form.get(k)||"");
  const rawStatus=get("status");
  const leadId=get("udf1");
  const txnid=get("txnid");
  const received=get("hash");
  const base=`${runtime.PAYU_SALT||""}|${rawStatus}||||||${get("udf5")}|${get("udf4")}|${get("udf3")}|${get("udf2")}|${leadId}|${get("email")}|${get("firstname")}|${get("productinfo")}|${get("amount")}|${txnid}|${get("key")}`;
  const reverse=get("additionalCharges")?`${get("additionalCharges")}|${base}`:base;
  const calculated=hex(await crypto.subtle.digest("SHA-512",new TextEncoder().encode(reverse)));
  const verified=!!runtime.PAYU_SALT&&calculated===received;

  if(!leadId||!verified){
    const lead=leadId?await runtime.DB.prepare("SELECT selected_nadi,payment_status,email,whatsapp FROM leads WHERE id=?").bind(leadId).first<{selected_nadi:string;payment_status:string;email:string;whatsapp:string}>():null;
    const slugs:Record<string,string>={shiva:"shiva-nadi",brahma:"brahma-nadi",nandi:"nandi-nadi",kaka:"kakabhushundi-nadi",vasishta:"vasishta-nadi",thirumoolar:"thirumoolar-nadi",bhogar:"bhogar-nadi",dhanvantari:"dhanvantari-nadi",shukra:"shukra-nadi",bhrigu:"bhrigu-nadi",atri:"atri-nadi",agastya:"agastya-nadi"};
    const url=new URL(lead?.selected_nadi&&slugs[lead.selected_nadi]?`/journey/${slugs[lead.selected_nadi]}`:"/journey",request.url);
    url.searchParams.set("payment",lead?.payment_status==="success"?"success":"pending");
    if(leadId)url.searchParams.set("lead",leadId);
    if(isInternalTestIdentity(lead?.email,lead?.whatsapp))url.searchParams.set("tracking","off");
    return Response.redirect(url,303);
  }

  const status=normalizePayuStatus(rawStatus);
  const paidCurrency=get("transactionCurrency")||get("currency");
  const amount=Number(get("amount"));
  const refundRequested=isRefundStatus(status)?1:0;

  await runtime.DB.prepare(
    refundRequested
      ? "UPDATE leads SET payment_status=?, status=?, refund_requested=1, refund_status=?, payment_amount=?, payment_currency=COALESCE(NULLIF(?,''),payment_currency) WHERE id=?"
      : "UPDATE leads SET payment_status=?, status=?, payment_amount=?, payment_currency=COALESCE(NULLIF(?,''),payment_currency) WHERE id=? AND (payment_status IS NULL OR payment_status!='success')"
  ).bind(
    status,
    status==="success"?"paid":status==="refunded"?"payment_refunded":"payment_failed",
    ...(refundRequested?[status,amount,paidCurrency,leadId]:[amount,paidCurrency,leadId])
  ).run().catch(async ()=>{
    // allow refund updates on records already marked success
    if(refundRequested){
      await runtime.DB.prepare(
        "UPDATE leads SET payment_status=?, status=?, refund_requested=1, refund_status=?, payment_amount=?, payment_currency=COALESCE(NULLIF(?,''),payment_currency) WHERE id=?"
      ).bind(
        status,
        status==="success"?"paid":"payment_refunded",
        status,
        amount,
        paidCurrency,
        leadId
      ).run();
      return;
    }
    if(status!=="success"){
      await runtime.DB.prepare("UPDATE leads SET payment_status=?, status=?, payment_amount=?, payment_currency=COALESCE(NULLIF(?,''),payment_currency) WHERE id=? AND (payment_status IS NULL OR payment_status!='success')").bind(
        status,
        status==="success"?"paid":"payment_failed",
        amount,
        paidCurrency,
        leadId
      ).run();
    }
  });

  if(status!=="success" && !refundRequested){
    const lead=await runtime.DB.prepare("SELECT selected_nadi,payment_status,email,whatsapp,visitor_id,name FROM leads WHERE id=?").bind(leadId).first<{selected_nadi:string;payment_status:string;email:string;whatsapp:string;visitor_id:string;name:string}>();
    if(lead?.visitor_id){
      getRequestExecutionContext()?.waitUntil(syncLeadToCrm({
        sourceLeadId:leadId,
        visitorId:lead.visitor_id,
        name:lead.name,
        email:lead.email,
        whatsapp:lead.whatsapp,
        selectedNadi:lead.selected_nadi||"",
        paymentStatus:status,
        paymentAmount:amount,
        paymentCurrency:paidCurrency,
        paymentTxnid:txnid,
        paymentProvider:"PayU",
        stage:"lf_payment_failed"
      }).catch(error=>({ok:false,error:String(error)})));
    }
  }

  if(status==="success"){
    const background=(async()=>{
      type PaidLead={visitor_id:string;email:string;whatsapp:string;name:string;selected_nadi?:string|null;meta_fbp:string|null;meta_fbc:string|null;client_user_agent:string|null;pricing_currency?:string|null;pricing_rate?:number|null;tiktok_ttp?:string|null;tiktok_ttclid?:string|null;client_ip?:string|null};
      const paidLead=await runtime.DB.prepare("SELECT visitor_id,email,whatsapp,name,selected_nadi,meta_fbp,meta_fbc,client_user_agent,pricing_currency,pricing_rate,tiktok_ttp,tiktok_ttclid,client_ip FROM leads WHERE id=?").bind(leadId).first<PaidLead>().catch(()=>runtime.DB.prepare("SELECT visitor_id,email,whatsapp,name,selected_nadi,meta_fbp,meta_fbc,client_user_agent FROM leads WHERE id=?").bind(leadId).first<PaidLead>());
      if(paidLead?.visitor_id)await recordFunnelEvent("payment_success",paidLead.visitor_id,leadId).catch(()=>{});
      if(paidLead){
        const currency=paidCurrency||paidLead.pricing_currency||"INR",metaResult=await sendVerifiedMetaPurchase({transactionId:txnid,leadId,amount:get("amount"),currency,email:paidLead.email,phone:paidLead.whatsapp,firstName:paidLead.name.trim().split(/\s+/)[0]||"",sourceUrl:new URL("/journey",request.url).toString(),fbp:paidLead.meta_fbp||"",fbc:paidLead.meta_fbc||"",clientUserAgent:paidLead.client_user_agent||""});
        console.info("Meta Purchase delivery",{leadId,transactionId:txnid,...metaResult});
        const nadi=paidLead.selected_nadi||"",context=getRequestExecutionContext();
        context?.waitUntil(sendTikTokServerEvent({
          event:"Purchase",eventId:`purchase-${leadId}`,
          leadId,
          amount:Number(get("amount")),
          currency,
          rateFromInr:Number(paidLead.pricing_rate)||1,
          contentId:nadi?`${nadi}-nadi-leaf-finding`:"nadi-leaf-finding",
          contentName:nadi?`${nadi} Nadi Leaf Finding`:"NadiVedas Leaf Finding",
          email:paidLead.email,
          phone:paidLead.whatsapp,
          sourceUrl:new URL(`/journey${nadi?`/${nadi}-nadi`:""}`,request.url).toString(),
          clientIp:paidLead.client_ip||"",
          clientUserAgent:paidLead.client_user_agent||"",
          ttclid:paidLead.tiktok_ttclid||"",
          ttp:paidLead.tiktok_ttp||""
        }).then(result=>console.info("TikTok Purchase delivery",{leadId,transactionId:txnid,...result})));

        context?.waitUntil(syncLeadToCrm({
          sourceLeadId:leadId,
          visitorId:paidLead.visitor_id,
          name:paidLead.name,
          email:paidLead.email,
          whatsapp:paidLead.whatsapp,
          selectedNadi:nadi,
          paymentStatus:"success",
          refundRequested:false,
          stage:"lf_paid"
        }).then(result=>runtime.DB.prepare("UPDATE leads SET crm_synced=?,crm_error=? WHERE id=?").bind(result.ok?1:0,result.error||null,leadId).run()));
      }
    })().catch(()=>console.error("PayU post-payment delivery failed"));
    getRequestExecutionContext()?.waitUntil(background);
  }

  if(refundRequested){
    const lead=await runtime.DB.prepare("SELECT selected_nadi,payment_status,email,whatsapp,visitor_id,name FROM leads WHERE id=?").bind(leadId).first<{selected_nadi:string;payment_status:string;email:string;whatsapp:string;visitor_id:string;name:string}>();
    if(lead?.visitor_id){
      getRequestExecutionContext()?.waitUntil(syncLeadToCrm({
        sourceLeadId:leadId,
        visitorId:lead.visitor_id,
        name:lead.name,
        email:lead.email,
        whatsapp:lead.whatsapp,
        selectedNadi:lead.selected_nadi||"",
        paymentStatus:"refunded",
        paymentAmount:amount,
        paymentCurrency:paidCurrency,
        paymentTxnid:txnid,
        paymentProvider:"PayU",
        refundRequested:true,
        refundStatus:status,
        stage:"lf_refunded"
      }).then(result=>runtime.DB.prepare("UPDATE leads SET crm_synced=?,crm_error=? WHERE id=?").bind(result.ok?1:0,result.error||null,leadId).run()));
    }
  }

  const lead=leadId?await runtime.DB.prepare("SELECT selected_nadi,payment_status,email,whatsapp FROM leads WHERE id=?").bind(leadId).first<{selected_nadi:string;payment_status:string;email:string;whatsapp:string}>():null;
  const slugs:Record<string,string>={shiva:"shiva-nadi",brahma:"brahma-nadi",nandi:"nandi-nadi",kaka:"kakabhushundi-nadi",vasishta:"vasishta-nadi",thirumoolar:"thirumoolar-nadi",bhogar:"bhogar-nadi",dhanvantari:"dhanvantari-nadi",shukra:"shukra-nadi",bhrigu:"bhrigu-nadi",atri:"atri-nadi",agastya:"agastya-nadi"};
  const url=new URL(lead?.selected_nadi&&slugs[lead.selected_nadi]?`/journey/${slugs[lead.selected_nadi]}`:"/journey",request.url);
  url.searchParams.set("payment",lead?.payment_status==="success"?"success":"pending");
  if(leadId)url.searchParams.set("lead",leadId);
  if(isInternalTestIdentity(lead?.email,lead?.whatsapp))url.searchParams.set("tracking","off");
  return Response.redirect(url,303);
}
