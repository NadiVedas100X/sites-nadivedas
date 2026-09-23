import { env } from "cloudflare:workers";
import {recordFunnelEvent} from "../../analytics/route";
import {sendTikTokServerEvent} from "../../../lib/tiktok-events";
import {getRequestExecutionContext} from "vinext/shims/request-context";
import {leafFindingAmount,type PricingProfile} from "../../../lib/pricing";
import {pricingForRequest} from "../../../lib/server-pricing";
import {payuCheckoutHtml} from "../../../lib/payu-checkout";
import {recoverPayuPayment} from "../../../lib/payu-recovery";

const hex = (buffer:ArrayBuffer)=>Array.from(new Uint8Array(buffer)).map(b=>b.toString(16).padStart(2,"0")).join("");
const esc = (v:string)=>v.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]||c));

export async function POST(request:Request){
  const runtime=env as unknown as {DB:D1Database;PAYU_KEY?:string;PAYU_SALT?:string;PAYU_MODE?:string};
  let data:FormData;
  try{data=await request.formData()}catch{return new Response("Missing booking reference",{status:400})}
  const leadId=String(data.get("leadId")||"");
  if(!leadId) return new Response("Missing booking reference",{status:400});
  type Lead={id:string;name:string;email:string;whatsapp:string;visitor_id:string;selected_nadi:string|null;pricing_country?:string|null;pricing_region?:PricingProfile["region"]|null;pricing_currency?:PricingProfile["currency"]|null;pricing_rate?:number|null;pricing_multiplier?:number|null;leaf_finding_amount?:number|null;offer_expires_at?:number|null;tiktok_ttp?:string|null;tiktok_ttclid?:string|null;client_ip?:string|null;client_user_agent?:string|null};
  let lead=await runtime.DB.prepare("SELECT id,name,email,whatsapp,visitor_id,selected_nadi,pricing_country,pricing_region,pricing_currency,pricing_rate,pricing_multiplier,leaf_finding_amount,offer_expires_at,tiktok_ttp,tiktok_ttclid,client_ip,client_user_agent FROM leads WHERE id=?").bind(leadId).first<Lead>().catch(()=>null);
  if(!lead)lead=await runtime.DB.prepare("SELECT id,name,email,whatsapp,visitor_id,selected_nadi FROM leads WHERE id=?").bind(leadId).first<Lead>();
  if(!lead) return new Response("Booking reference not found",{status:404});
  if(!runtime.PAYU_KEY||!runtime.PAYU_SALT)return new Response("Payment is temporarily unavailable. Please contact support.",{status:503});
  // A retry must never replace a paid or unresolved transaction.
  let previous:string;
  try { previous=await recoverPayuPayment(lead.id); } catch { previous="pending"; }
  if(previous==="success"||previous==="pending") {
    const resume=new URL("/journey",request.url);resume.searchParams.set("lead",lead.id);resume.searchParams.set("payment",previous);
    return Response.redirect(resume,303);
  }
  const txnid=`NV${crypto.randomUUID().replaceAll("-","").slice(0,18)}`;
  // The Shiva lineage landing page has its own ₹1,001 leaf-finding offer.
  // Resolve the amount from the stored lead rather than trusting browser input.
  const nadiNames:Record<string,string>={shiva:"Shiva Nadi",brahma:"Brahma Nadi",nandi:"Nandi Nadi",kaka:"Kakabhushundi Nadi",vasishta:"Vasishta Nadi",thirumoolar:"Thirumoolar Nadi",bhogar:"Bhogar Nadi",dhanvantari:"Dhanvantari Nadi",shukra:"Shukra Nadi",bhrigu:"Bhrigu Nadi",atri:"Atri Nadi",agastya:"Agastya Nadi"};
  const current=await pricingForRequest(request),offerValid=Number(lead.offer_expires_at)>Date.now(),pricing:PricingProfile=lead.pricing_currency&&lead.pricing_region?{country:lead.pricing_country||current.country,region:lead.pricing_region,currency:lead.pricing_currency,rateFromInr:Number(lead.pricing_rate)||current.rateFromInr,nadiMultiplier:Number(lead.pricing_multiplier)||current.nadiMultiplier,leafFinding:offerValid?Number(lead.leaf_finding_amount)||current.leafFinding:current.leafFinding,updatedAt:current.updatedAt}:current;
  const amount=leafFindingAmount(pricing,lead.selected_nadi||"").toFixed(2),productinfo=lead.selected_nadi?`${nadiNames[lead.selected_nadi]||"Nadi"} Leaf Finding`:"NadiVedas Leaf Finding",firstname=lead.name.trim().split(/\s+/)[0]||"Seeker";
  const origin=new URL(request.url).origin,callback=`${origin}/api/payu/callback`;
  // PayU's request hash must include udf1..udf5 followed by five reserved
  // empty fields: key|txnid|amount|productinfo|firstname|email|udf1|...|udf5||||||salt
  const sequence=[runtime.PAYU_KEY,txnid,amount,productinfo,firstname,lead.email,lead.id,"","","","","","","","","",runtime.PAYU_SALT].join("|");
  const hash=hex(await crypto.subtle.digest("SHA-512",new TextEncoder().encode(sequence)));
  await runtime.DB.prepare("UPDATE leads SET payment_txnid=?, payment_status='initiated', payment_amount=?, payment_currency=? WHERE id=?").bind(txnid,Number(amount),pricing.currency,lead.id).run().catch(()=>runtime.DB.prepare("UPDATE leads SET payment_txnid=?, payment_status='initiated' WHERE id=?").bind(txnid,lead.id).run());
  if(lead.visitor_id)await recordFunnelEvent("payment_started",lead.visitor_id,lead.id);
  getRequestExecutionContext()?.waitUntil(sendTikTokServerEvent({event:"InitiateCheckout",eventId:`checkout-${lead.id}`,leadId:lead.id,amount:Number(amount),currency:pricing.currency,rateFromInr:pricing.rateFromInr,contentId:lead.selected_nadi?`${lead.selected_nadi}-nadi-leaf-finding`:"nadi-leaf-finding",contentName:productinfo,email:lead.email,phone:lead.whatsapp,sourceUrl:new URL(`/journey${lead.selected_nadi?`/${lead.selected_nadi}-nadi`:""}`,request.url).toString(),clientIp:lead.client_ip||"",clientUserAgent:lead.client_user_agent||"",ttclid:lead.tiktok_ttclid||"",ttp:lead.tiktok_ttp||""}).then(result=>console.info("TikTok InitiateCheckout delivery",{leadId:lead.id,...result})));
  const fields:Record<string,string>={key:runtime.PAYU_KEY,txnid,amount,productinfo,firstname,email:lead.email,phone:lead.whatsapp,surl:callback,furl:callback,udf1:lead.id,udf2:"",udf3:"",udf4:"",udf5:"",hash};
  if(pricing.currency!=="INR")fields.transactionCurrency=pricing.currency;
  return new Response(payuCheckoutHtml(fields,runtime.PAYU_MODE==="test"),{headers:{"content-type":"text/html;charset=UTF-8","cache-control":"no-store","referrer-policy":"no-referrer"}});
}
