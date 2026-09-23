import {env} from "cloudflare:workers";

type Runtime={DB:D1Database;TIKTOK_EVENTS_ACCESS_TOKEN?:string;TIKTOK_PIXEL_ID?:string;TIKTOK_EVENTS_API_URL?:string};
type TikTokEvent={event:"CompleteRegistration"|"InitiateCheckout"|"Purchase";eventId:string;leadId:string;amount:number;currency:string;rateFromInr?:number;contentId:string;contentName:string;email:string;phone:string;sourceUrl:string;clientIp?:string;clientUserAgent?:string;ttclid?:string;ttp?:string};
const INR_PER_USD=95.2053;
const encoder=new TextEncoder();
const hex=(buffer:ArrayBuffer)=>Array.from(new Uint8Array(buffer)).map(byte=>byte.toString(16).padStart(2,"0")).join("");
const sha256=async(value:string)=>hex(await crypto.subtle.digest("SHA-256",encoder.encode(value.trim().toLowerCase())));
const digits=(value:string)=>value.replace(/\D/g,"");

let deliverySchemaReady:Promise<unknown>|null=null;
function ensureDeliverySchema(runtime:Runtime){
  if(!deliverySchemaReady)deliverySchemaReady=runtime.DB.batch([
    runtime.DB.prepare(`CREATE TABLE IF NOT EXISTS tiktok_event_deliveries (
      event_id TEXT PRIMARY KEY NOT NULL,
      lead_id TEXT NOT NULL,
      event_name TEXT NOT NULL,
      value TEXT NOT NULL,
      currency TEXT NOT NULL DEFAULT 'USD',
      status TEXT NOT NULL DEFAULT 'pending',
      attempts INTEGER NOT NULL DEFAULT 0,
      api_response TEXT,
      last_error TEXT,
      created_at INTEGER NOT NULL,
      sent_at INTEGER
    )`),
    runtime.DB.prepare("CREATE INDEX IF NOT EXISTS tiktok_event_deliveries_lead_idx ON tiktok_event_deliveries(lead_id,created_at)"),
  ]).catch(error=>{deliverySchemaReady=null;throw error});
  return deliverySchemaReady;
}

export async function sendTikTokServerEvent(event:TikTokEvent){
  const runtime=env as unknown as Runtime,now=Date.now(),inrAmount=event.currency==="INR"?event.amount:event.amount/(event.rateFromInr||1),value=event.currency==="USD"?Number(event.amount.toFixed(2)):Number((inrAmount/INR_PER_USD).toFixed(2));
  await ensureDeliverySchema(runtime);
  await runtime.DB.prepare(`INSERT OR IGNORE INTO tiktok_event_deliveries (event_id,lead_id,event_name,value,currency,status,attempts,created_at) VALUES (?,?,?,?,?,'pending',0,?)`).bind(event.eventId,event.leadId,event.event,String(value),"USD",now).run();
  const claimed=await runtime.DB.prepare("UPDATE tiktok_event_deliveries SET status='sending',attempts=attempts+1,last_error=NULL WHERE event_id=? AND status IN ('pending','failed')").bind(event.eventId).run();
  if(!claimed.meta.changes)return {sent:false,reason:"already_processed"} as const;
  const token=runtime.TIKTOK_EVENTS_ACCESS_TOKEN,pixelId=runtime.TIKTOK_PIXEL_ID||"DA3FQ3JC77U14HQM5JR0";
  if(!token){await runtime.DB.prepare("UPDATE tiktok_event_deliveries SET status='failed',last_error=? WHERE event_id=?").bind("TikTok Events API access token is not configured",event.eventId).run();return {sent:false,reason:"not_configured"} as const}
  const user:Record<string,string>={email:await sha256(event.email),external_id:await sha256(event.leadId)};const phone=digits(event.phone);if(phone)user.phone=await sha256(phone);if(event.clientIp)user.ip=event.clientIp;if(event.clientUserAgent)user.user_agent=event.clientUserAgent;if(event.ttclid)user.ttclid=event.ttclid;if(event.ttp)user.ttp=event.ttp;
  const body={event_source:"web",event_source_id:pixelId,data:[{event:event.event,event_time:Math.floor(now/1000),event_id:event.eventId,user,properties:{value,currency:"USD",contents:[{content_id:event.contentId,content_type:"product",content_name:event.contentName,price:value}]},page:{url:event.sourceUrl}}]};
  try{const response=await fetch(runtime.TIKTOK_EVENTS_API_URL||"https://business-api.tiktok.com/open_api/v1.3/event/track/",{method:"POST",headers:{"Access-Token":token,"Content-Type":"application/json"},body:JSON.stringify(body)});const responseText=await response.text();if(!response.ok)throw new Error(`TikTok Events API ${response.status}: ${responseText.slice(0,1000)}`);let parsed:{code?:number,message?:string}={};try{parsed=JSON.parse(responseText)}catch{}if(parsed.code&&parsed.code!==0)throw new Error(`TikTok Events API code ${parsed.code}: ${String(parsed.message||responseText).slice(0,1000)}`);await runtime.DB.prepare("UPDATE tiktok_event_deliveries SET status='sent',api_response=?,sent_at=? WHERE event_id=?").bind(responseText.slice(0,4000),Date.now(),event.eventId).run();return {sent:true} as const}catch(error){const message=error instanceof Error?error.message:"Unknown TikTok Events API error";await runtime.DB.prepare("UPDATE tiktok_event_deliveries SET status='failed',last_error=? WHERE event_id=?").bind(message.slice(0,2000),event.eventId).run();return {sent:false,reason:"delivery_failed"} as const}
}
