import { env } from "cloudflare:workers";
import {confirmPaidPreference} from './booking-preference';

type CrmLead = { initialInterest?:string; nadiDecided?:boolean; paymentAmount?:number; paymentCurrency?:string; paymentTxnid?:string; paymentProvider?:string; referralToken?:string; sourceLeadId:string; visitorId?:string; name:string; email:string; whatsapp:string; birthYear?:number; gender?:string; state?:string; country?:string; languages?:string[]; selectedNadi?:string; paymentStatus?:string; stage?:string; sessionAt?:number|null; operations?:string; landingUrl?:string; followupConsent?:boolean; consentAt?:number|null; thumbprintStatus?:string; thumbprintFeedback?:string; thumbprintUrl?:string; selectedTimeslot?:number|null; poc?:string; refundRequested?:boolean; refundStatus?:string };

function hex(bytes:ArrayBuffer){return Array.from(new Uint8Array(bytes),byte=>byte.toString(16).padStart(2,"0")).join("");}
function base64url(bytes:ArrayBuffer){return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/g,"");}

async function withPayment(lead:CrmLead):Promise<CrmLead>{
  const attribution=await env.DB.prepare('SELECT initial_interest,nadi_decided,thumbprint_key,followup_consent,consent_at FROM leads WHERE id=?').bind(lead.sourceLeadId).first<{initial_interest:string|null;nadi_decided:number;thumbprint_key:string|null;followup_consent:number;consent_at:number|null}>().catch(()=>null);
  // Keep acquisition interest separate from the customer's final selection.
  lead={...lead,...(attribution?{initialInterest:attribution.initial_interest||'',nadiDecided:Boolean(attribution.nadi_decided),followupConsent:Boolean(attribution.followup_consent),consentAt:attribution.consent_at}:{})};
  const ingestSecret=(env as unknown as {LEAD_INGEST_SECRET?:string}).LEAD_INGEST_SECRET;
  if(attribution?.thumbprint_key&&ingestSecret){
    const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(ingestSecret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
    const token=hex(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(`thumbprint:${lead.sourceLeadId}`)));
    lead={...lead,thumbprintStatus:'accepted',thumbprintUrl:`https://www.nadivedas.com/api/leads/${encodeURIComponent(lead.sourceLeadId)}/thumbprint?token=${token}`};
  }
  const paid=await env.DB.prepare("SELECT payment_status,payment_txnid,payment_amount,payment_currency,refund_requested,refund_status FROM leads WHERE id=?").bind(lead.sourceLeadId).first<{payment_status:string;payment_txnid:string;payment_amount:number;payment_currency:string;refund_requested:number;refund_status:string}>();
  if(!paid)return {...lead,sessionAt:null,selectedTimeslot:null};
  if(paid.refund_requested) lead={...lead,refundRequested:true,refundStatus:paid.refund_status||"refund_requested"};
  if(paid.payment_status!=="success")return {...lead,paymentStatus:paid.payment_status,paymentTxnid:paid.payment_txnid,paymentAmount:paid.payment_amount,paymentCurrency:paid.payment_currency,sessionAt:null,selectedTimeslot:null};
  const sessionAt=await confirmPaidPreference(lead.sourceLeadId).catch(()=>null);
  return {...lead,paymentStatus:"success",paymentTxnid:paid.payment_txnid,paymentAmount:paid.payment_amount,paymentCurrency:paid.payment_currency,...(sessionAt?{sessionAt,selectedTimeslot:sessionAt}:{})};
}

export async function createCrmEnvelope(lead:CrmLead){
  lead=await withPayment(lead);
  const runtime=env as unknown as {LEAD_INGEST_SECRET?:string};
  if(!runtime.LEAD_INGEST_SECRET)return null;
  const payload=JSON.stringify({...lead,source:"nadivedas.com",signedAt:Date.now()});
  const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(runtime.LEAD_INGEST_SECRET),{name:"HMAC",hash:"SHA-256"},false,["sign"]);
  const signature=hex(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(payload)));
  return {payload,signature};
}

export async function syncLeadToCrm(lead:CrmLead) {
  const runtime=env as unknown as {CRM_LEADS_URL?:string;LEGACY_CRM_LEADS_URL?:string;LEAD_INGEST_SECRET?:string;LEGACY_CRM_SIGNING_PRIVATE_JWK?:string};
  if(!runtime.CRM_LEADS_URL||!runtime.LEAD_INGEST_SECRET) return {ok:false,error:"CRM connection is not configured"};
  const destinations=Array.from(new Set([
    runtime.CRM_LEADS_URL,
    runtime.LEGACY_CRM_LEADS_URL||"https://nadi-ai.pages.dev/api/lead-ingest",
  ].map(value=>String(value||"").trim()).filter(Boolean)));
  let effectiveLead:CrmLead=await withPayment(lead);
  if(!effectiveLead.referralToken){const stored=await env.DB.prepare("SELECT referral_token FROM leads WHERE id=?").bind(lead.sourceLeadId).first<{referral_token:string}>().catch(()=>null);if(stored?.referral_token)effectiveLead.referralToken=stored.referral_token;}
  let body=JSON.stringify({...effectiveLead,source:"nadivedas.com"});
  const signedHeaders=async()=>{
    if(!runtime.LEGACY_CRM_SIGNING_PRIVATE_JWK)return null;
    const timestamp=String(Date.now()),jwk=JSON.parse(runtime.LEGACY_CRM_SIGNING_PRIVATE_JWK) as JsonWebKey;
    const key=await crypto.subtle.importKey("jwk",jwk,{name:"ECDSA",namedCurve:"P-256"},false,["sign"]);
    const signature=await crypto.subtle.sign({name:"ECDSA",hash:"SHA-256"},key,new TextEncoder().encode(`${timestamp}.${body}`));
    return {"x-nadivedas-timestamp":timestamp,"x-nadivedas-signature":base64url(signature)};
  };
  const legacyHeaders=await signedHeaders().catch(()=>null);
  // The old CRM is the single round-robin authority. Send there first, then pass
  // its chosen POC name into PoojaCRM so the two systems cannot choose differently.
  const legacyUrl=destinations.find(url=>new URL(url).hostname==="nadi-ai.pages.dev");
  const results:Array<{url:string;ok:boolean;status:number;error:string}>=[];
  if(legacyUrl){
    try{
      const authHeaders=legacyHeaders?legacyHeaders:{"x-lead-ingest-secret":runtime.LEAD_INGEST_SECRET!};
      const response=await fetch(legacyUrl,{method:"POST",headers:{"content-type":"application/json",...authHeaders},body});
      const payload=await response.json().catch(()=>({})) as {consultant_name?:string};
      results.push({url:legacyUrl,ok:response.ok,status:response.status,error:response.ok?"":`responded ${response.status}`});
      if(response.ok&&payload.consultant_name){effectiveLead={...effectiveLead,poc:payload.consultant_name};body=JSON.stringify({...effectiveLead,source:"nadivedas.com"});}
    }catch(error){results.push({url:legacyUrl,ok:false,status:0,error:error instanceof Error?error.message:"connection failed"});}
  }
  const remaining=destinations.filter(url=>url!==legacyUrl);
  results.push(...await Promise.all(remaining.map(async url=>{
    try{
      const response=await fetch(url,{method:"POST",headers:{"content-type":"application/json","x-lead-ingest-secret":runtime.LEAD_INGEST_SECRET!},body});
      return {url,ok:response.ok,status:response.status,error:response.ok?"":`responded ${response.status}`};
    }catch(error){return {url,ok:false,status:0,error:error instanceof Error?error.message:"connection failed"};}
  })));
  const failed=results.filter(result=>!result.ok);
  return {ok:failed.length===0,error:failed.map(result=>`${new URL(result.url).hostname} ${result.error}`).join("; "),destinations:results};
}
