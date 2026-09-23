import { env } from "cloudflare:workers";
import { createCrmEnvelope, syncLeadToCrm } from "../../lib/crm";
import {recordFunnelEvent} from "../analytics/route";
import {sendTikTokServerEvent} from "../../lib/tiktok-events";
import {getRequestExecutionContext} from "vinext/shims/request-context";
import {pricingForRequest} from "../../lib/server-pricing";
import {availablePreferredTime} from '../../lib/booking-preference';
import {isInternalTestIdentity} from '../../lib/tracking-exclusions';

let schemaReady:Promise<unknown>|null=null;
function hex(bytes:ArrayBuffer){return Array.from(new Uint8Array(bytes),byte=>byte.toString(16).padStart(2,"0")).join("")}
async function thumbprintAccessToken(id:string,secret:string){const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);return hex(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(`thumbprint:${id}`)))}
async function ready(){
  if(!schemaReady)schemaReady=(async()=>{
  const columns=(await env.DB.prepare("PRAGMA table_info(leads)").all<{name:string}>()).results.map(column=>column.name);
  const additions=[
    ["referral_token","ALTER TABLE leads ADD COLUMN referral_token TEXT"],
    ["nadi_decided","ALTER TABLE leads ADD COLUMN nadi_decided INTEGER NOT NULL DEFAULT 0"],
    ["initial_interest","ALTER TABLE leads ADD COLUMN initial_interest TEXT"],
    ["tiktok_ttp","ALTER TABLE leads ADD COLUMN tiktok_ttp TEXT"],
    ["tiktok_ttclid","ALTER TABLE leads ADD COLUMN tiktok_ttclid TEXT"],
    ["client_ip","ALTER TABLE leads ADD COLUMN client_ip TEXT"],
    ["pricing_country","ALTER TABLE leads ADD COLUMN pricing_country TEXT"],
    ["pricing_region","ALTER TABLE leads ADD COLUMN pricing_region TEXT"],
    ["pricing_currency","ALTER TABLE leads ADD COLUMN pricing_currency TEXT"],
    ["pricing_rate","ALTER TABLE leads ADD COLUMN pricing_rate REAL"],
    ["pricing_multiplier","ALTER TABLE leads ADD COLUMN pricing_multiplier REAL"],
    ["leaf_finding_amount","ALTER TABLE leads ADD COLUMN leaf_finding_amount REAL"],
    ["offer_expires_at","ALTER TABLE leads ADD COLUMN offer_expires_at INTEGER"],
    ["payment_amount","ALTER TABLE leads ADD COLUMN payment_amount REAL"],
    ["payment_currency","ALTER TABLE leads ADD COLUMN payment_currency TEXT"],
    ["refund_requested","ALTER TABLE leads ADD COLUMN refund_requested INTEGER NOT NULL DEFAULT 0"],
    ["refund_status","ALTER TABLE leads ADD COLUMN refund_status TEXT"],
    ["session_selected_at","ALTER TABLE leads ADD COLUMN session_selected_at INTEGER"],
    ["followup_consent","ALTER TABLE leads ADD COLUMN followup_consent INTEGER NOT NULL DEFAULT 0"],
    ["consent_at","ALTER TABLE leads ADD COLUMN consent_at INTEGER"],
    ["visitor_id","ALTER TABLE leads ADD COLUMN visitor_id TEXT NOT NULL DEFAULT ''"],
    ["state","ALTER TABLE leads ADD COLUMN state TEXT NOT NULL DEFAULT ''"],
    ["country","ALTER TABLE leads ADD COLUMN country TEXT NOT NULL DEFAULT ''"],
  ] as const;
  const existing=columns.length?[]:[env.DB.prepare(`CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY, referral_token TEXT, initial_interest TEXT, nadi_decided INTEGER NOT NULL DEFAULT 0, name TEXT NOT NULL, email TEXT NOT NULL, whatsapp TEXT NOT NULL,
    birth_year INTEGER, gender TEXT, languages TEXT NOT NULL DEFAULT '[]', selected_nadi TEXT,
    payment_txnid TEXT, payment_status TEXT, status TEXT NOT NULL DEFAULT 'interested',
    crm_synced INTEGER NOT NULL DEFAULT 0, crm_error TEXT, thumbprint_key TEXT, thumbprint_name TEXT,
    session_at INTEGER, session_selected_at INTEGER, followup_consent INTEGER NOT NULL DEFAULT 0,
    consent_at INTEGER, visitor_id TEXT NOT NULL DEFAULT '', state TEXT NOT NULL DEFAULT '', country TEXT NOT NULL DEFAULT '',
    meta_fbp TEXT, meta_fbc TEXT, client_user_agent TEXT, tiktok_ttp TEXT, tiktok_ttclid TEXT, client_ip TEXT,
    pricing_country TEXT,
    pricing_region TEXT,
    pricing_currency TEXT,
    pricing_rate REAL,
    pricing_multiplier REAL,
    leaf_finding_amount REAL,
    offer_expires_at INTEGER,
    payment_amount REAL,
    payment_currency TEXT,
    created_at INTEGER NOT NULL
  )`)];
  const alters=columns.length?additions.filter(([name])=>!columns.includes(name)).map(([,sql])=>env.DB.prepare(sql)):[];
  return env.DB.batch([...existing,...alters,
  env.DB.prepare("CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at)"),
  ]);
  })().catch(error=>{schemaReady=null;throw error});
  await schemaReady;
}

export async function POST(request: Request){
  await ready();
  const body=await request.json() as {name?:string;email?:string;whatsapp?:string;countryCode?:string;birthYear?:number|string;gender?:string;languages?:string[];otherLanguage?:string;followupConsent?:boolean|string;visitorId?:string;state?:string;country?:string;interest?:string;metaFbp?:string;metaFbc?:string;tiktokTtp?:string;tiktokTtclid?:string;offerStartedAt?:number};
  const year=new Date().getFullYear(),birthYear=Number(body.birthYear),email=String(body.email||"").trim().toLowerCase();
  const supported=["English","Hindi","Telugu","Tamil","Kannada","Malayalam"],languages=Array.isArray(body.languages)?body.languages.filter((item)=>supported.includes(item)):[];
  if(body.otherLanguage?.trim())languages.push(body.otherLanguage.trim().slice(0,60));
  const digits=String(body.whatsapp||"").replace(/\D/g,""),countryCode=String(body.countryCode||"+91"),whatsapp=`${countryCode}${digits}`;
  const emailPattern=/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
  const badDomains=new Set(["gmail.co","gamil.com","gmial.com","yahoo.co","hotmai.com","outlok.com"]);
  if(!body.name?.trim()||!email||!digits||!body.gender||!languages.length||!(body.followupConsent===true||body.followupConsent==="on")) return Response.json({error:"Please complete every required field and confirm contact consent."},{status:400});
  if(!emailPattern.test(email)||badDomains.has(email.split("@")[1]||""))return Response.json({error:"Please enter a complete, valid email address."},{status:400});
  if(!Number.isInteger(birthYear)||birthYear<year-80||birthYear>year-10)return Response.json({error:`Birth year must be between ${year-80} and ${year-10}.`},{status:400});
  if(!["male","female"].includes(body.gender))return Response.json({error:"Please select male or female."},{status:400});
  if(countryCode==="+91"?!/^[6-9]\d{9}$/.test(digits):!/^[0-9]{6,15}$/.test(digits))return Response.json({error:countryCode==="+91"?"Enter a valid 10-digit Indian WhatsApp number.":"Enter a valid WhatsApp number."},{status:400});
  const state=String(body.state||"").trim(),country=countryCode==="+91"?"India":String(body.country||"").trim();if(countryCode==="+91"?!state:!country)return Response.json({error:countryCode==="+91"?"Please select your state for GST billing.":"Please enter your country."},{status:400});
  const id=crypto.randomUUID();
  const consentAt=Date.now();
  const interest=["shiva","brahma","nandi","kaka","vasishta","thirumoolar","bhogar","dhanvantari","shukra","bhrigu","atri","agastya"].includes(String(body.interest||""))?String(body.interest):"";
  const basePricing=await pricingForRequest(request),offerStartedAt=Number(body.offerStartedAt),offerAge=consentAt-offerStartedAt;
  const offerActive=basePricing.region==="india"&&!interest&&Number.isFinite(offerStartedAt)&&offerAge>=0&&offerAge<=9*60*1000;
  const pricing={...basePricing,leafFinding:offerActive?540:basePricing.leafFinding};
  const offerExpiresAt=offerActive?offerStartedAt+9*60*1000:null;
  const visitor=String(body.visitorId||id).slice(0,80),metaFbp=String(body.metaFbp||"").slice(0,255),metaFbc=String(body.metaFbc||"").slice(0,1024),clientUserAgent=String(request.headers.get("user-agent")||"").slice(0,1024),tiktokTtp=String(body.tiktokTtp||"").slice(0,255),tiktokTtclid=String(body.tiktokTtclid||"").slice(0,1024),clientIp=String(request.headers.get("cf-connecting-ip")||request.headers.get("x-forwarded-for")||"").split(",")[0].trim().slice(0,64);await env.DB.prepare("INSERT INTO leads (id,name,email,whatsapp,birth_year,gender,languages,selected_nadi,status,followup_consent,consent_at,visitor_id,state,country,meta_fbp,meta_fbc,client_user_agent,tiktok_ttp,tiktok_ttclid,client_ip,pricing_country,pricing_region,pricing_currency,pricing_rate,pricing_multiplier,leaf_finding_amount,offer_expires_at,created_at) VALUES (?,?,?,?,?,?,?,?,?,1,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)").bind(id,body.name.trim(),email,whatsapp,birthYear,body.gender,JSON.stringify(languages),interest,"interested",consentAt,visitor,state,country,metaFbp||null,metaFbc||null,clientUserAgent||null,tiktokTtp||null,tiktokTtclid||null,clientIp||null,pricing.country,pricing.region,pricing.currency,pricing.rateFromInr,pricing.nadiMultiplier,pricing.leafFinding,offerExpiresAt,consentAt).run();
  const referralToken=(request.headers.get("cookie")||"").split(";").map(x=>x.trim()).find(x=>x.startsWith("nv_referral="))?.slice(12)||"";
  await env.DB.prepare("UPDATE leads SET initial_interest=? WHERE id=?").bind(interest,id).run();
  if(referralToken) await env.DB.prepare("UPDATE leads SET referral_token=? WHERE id=?").bind(referralToken.slice(0,2048),id).run();
  const crmLead={referralToken,sourceLeadId:id,visitorId:visitor,name:body.name.trim(),email,whatsapp,birthYear,gender:body.gender,state,country,languages,selectedNadi:interest,stage:"contact",landingUrl:request.headers.get("referer")||"https://www.nadivedas.com/journey",followupConsent:true,consentAt};
  const crm=await createCrmEnvelope(crmLead);
  getRequestExecutionContext()?.waitUntil(syncLeadToCrm(crmLead).then(result=>env.DB.prepare("UPDATE leads SET crm_synced=?,crm_error=? WHERE id=?").bind(result.ok?1:0,result.error||null,id).run()).catch(error=>env.DB.prepare("UPDATE leads SET crm_synced=0,crm_error=? WHERE id=?").bind(error instanceof Error?error.message.slice(0,500):"CRM synchronization failed",id).run()));
  const contentName=interest?`${interest} Nadi Leaf Finding`:"NadiVedas Leaf Finding";getRequestExecutionContext()?.waitUntil(sendTikTokServerEvent({event:"CompleteRegistration",eventId:`registration-${id}`,leadId:id,amount:pricing.leafFinding,currency:pricing.currency,rateFromInr:pricing.rateFromInr,contentId:interest?`${interest}-nadi-leaf-finding`:"nadi-leaf-finding",contentName,email,phone:whatsapp,sourceUrl:request.headers.get("referer")||"https://www.nadivedas.com/journey",clientIp,clientUserAgent,ttclid:tiktokTtclid,ttp:tiktokTtp}).then(result=>console.info("TikTok CompleteRegistration delivery",{leadId:id,...result})));
  return Response.json({id,crm},{status:201});
}

export async function GET(request:Request){
  await ready();const runtime=env as unknown as {CRM_RECONCILE_SECRET?:string};const url=new URL(request.url),id=url.searchParams.get("id");
if(id){const lead=await env.DB.prepare("SELECT id,name,email,whatsapp,birth_year,gender,languages,selected_nadi,nadi_decided,payment_status,status,refund_requested,refund_status,session_at,session_selected_at,thumbprint_key,followup_consent,consent_at FROM leads WHERE id=?").bind(id).first<{id:string;name:string;email:string;whatsapp:string;birth_year:number;gender:string;languages:string;selected_nadi:string;nadi_decided:number;payment_status:string;status:string;refund_requested:number;refund_status:string|null;session_at:number|null;session_selected_at:number|null;thumbprint_key:string|null;followup_consent:number;consent_at:number|null}>();if(!lead)return Response.json({error:"Lead not found"},{status:404});const metaDelivery=await env.DB.prepare("SELECT status,attempts,last_error,sent_at FROM meta_purchase_deliveries WHERE lead_id=? ORDER BY created_at DESC LIMIT 1").bind(id).first<{status:string;attempts:number;last_error:string|null;sent_at:number|null}>().catch(()=>null);const stage=lead.thumbprint_key?"thumbprint_uploaded":lead.session_at?"lf_scheduled":lead.payment_status==="success"?"lf_paid":lead.payment_status==="initiated"?"lf_payment_pending":lead.payment_status&&lead.payment_status!=="not_started"?"lf_payment_failed":"contact",secret=(env as unknown as {LEAD_INGEST_SECRET?:string}).LEAD_INGEST_SECRET||"",token=lead.thumbprint_key&&secret?await thumbprintAccessToken(lead.id,secret):"",thumbprintUrl=token?`https://www.nadivedas.com/api/leads/${encodeURIComponent(lead.id)}/thumbprint?token=${token}`:"";const crm=await createCrmEnvelope({sourceLeadId:lead.id,name:lead.name,email:lead.email,whatsapp:lead.whatsapp,birthYear:lead.birth_year,gender:lead.gender,languages:JSON.parse(lead.languages||"[]"),selectedNadi:lead.selected_nadi||"",paymentStatus:lead.payment_status||"not_started",stage:lead.payment_status==="refunded"||lead.status==="payment_refunded"?"lf_refunded":"lf_paid",refundRequested:Boolean(lead.refund_requested),refundStatus:lead.refund_status||undefined,sessionAt:lead.session_at,operations:lead.thumbprint_key?"thumbprint_received":"",thumbprintStatus:lead.thumbprint_key?"accepted":"not_uploaded",thumbprintUrl,followupConsent:Boolean(lead.followup_consent),consentAt:lead.consent_at,selectedTimeslot:lead.session_at});if(crm){const delivered=JSON.parse(crm.payload);if(delivered.sessionAt)lead.session_at=delivered.sessionAt;}return Response.json({crm,lead:{nadiDecided:Boolean(lead.nadi_decided),gender:lead.gender,sessionAt:lead.session_at,sessionSelectedAt:lead.session_selected_at,thumbprintUploaded:Boolean(lead.thumbprint_key),selectedNadi:lead.selected_nadi||"",paymentStatus:lead.payment_status||"not_started",refundRequested:Boolean(lead.refund_requested),refundStatus:lead.refund_status||undefined,trackingExcluded:isInternalTestIdentity(lead.email,lead.whatsapp),metaDelivery:metaDelivery?{status:metaDelivery.status,attempts:metaDelivery.attempts,lastError:metaDelivery.last_error,sentAt:metaDelivery.sent_at}:null}});}
  if(!runtime.CRM_RECONCILE_SECRET||request.headers.get("x-reconcile-secret")!==runtime.CRM_RECONCILE_SECRET)return Response.json({error:"Unauthorized"},{status:401});
  const rows=(await env.DB.prepare("SELECT id,name,email,whatsapp,birth_year,gender,languages,selected_nadi,payment_status,status,refund_requested,refund_status FROM leads WHERE payment_status IN ('success','refunded') OR status IN ('paid','payment_refunded') ORDER BY created_at DESC LIMIT 100").all<{id:string;name:string;email:string;whatsapp:string;birth_year:number;gender:string;languages:string;selected_nadi:string;payment_status:string;status:string;refund_requested:number;refund_status:string|undefined}>()).results;
  return Response.json({envelopes:await Promise.all(rows.map(async lead=>createCrmEnvelope({sourceLeadId:lead.id,name:lead.name,email:lead.email,whatsapp:lead.whatsapp,birthYear:lead.birth_year,gender:lead.gender,languages:JSON.parse(lead.languages||"[]"),selectedNadi:lead.selected_nadi||"",paymentStatus:lead.payment_status||"not_started",stage:lead.status==="payment_refunded"||lead.payment_status==="refunded"?"lf_refunded":"lf_paid",refundRequested:Boolean(lead.refund_requested),refundStatus:lead.refund_status||undefined})))});
}

export async function PATCH(request: Request){
  await ready(); const body=await request.json() as {id?:string,nadi?:string,sessionAt?:number,reschedule?:boolean,thumbprintHelp?:boolean};
  if(!body.id||(!body.nadi&&!body.sessionAt&&!body.thumbprintHelp)) return Response.json({error:"Required fields missing"},{status:400});
  if(body.sessionAt){const paid=await env.DB.prepare("SELECT payment_status FROM leads WHERE id=?").bind(body.id).first<{payment_status:string}>();if(paid?.payment_status!=="success")return Response.json({error:"Payment must be confirmed before booking a calendar event."},{status:409});}
  if(body.sessionAt){try{if(!Number.isFinite(body.sessionAt)||body.sessionAt<=Date.now()||!await availablePreferredTime(body.sessionAt))return Response.json({error:'This time is no longer available. Choose another time.'},{status:409});}catch{return Response.json({error:'Availability could not be checked. Please retry.'},{status:503});}}
  if(body.nadi)await env.DB.prepare("UPDATE leads SET selected_nadi=?, nadi_decided=1, status='nadi_selected' WHERE id=?").bind(body.nadi,body.id).run();
  if(body.sessionAt)await env.DB.prepare("UPDATE leads SET session_at=?,session_selected_at=?, status='scheduled' WHERE id=?").bind(body.sessionAt,Date.now(),body.id).run();
  if(body.thumbprintHelp)await env.DB.prepare("UPDATE leads SET status='thumbprint_needs_help' WHERE id=?").bind(body.id).run();
  const tracked=await env.DB.prepare("SELECT visitor_id FROM leads WHERE id=?").bind(body.id).first<{visitor_id:string}>();if(tracked?.visitor_id)await recordFunnelEvent(body.nadi?"nadi_selected":"timeslot_selected",tracked.visitor_id,body.id);
  const lead=await env.DB.prepare("SELECT name,email,whatsapp,birth_year,languages,gender,selected_nadi FROM leads WHERE id=?").bind(body.id).first<{name:string;email:string;whatsapp:string;birth_year:number;languages:string;gender:string;selected_nadi:string}>();
  const crmLead=lead?{sourceLeadId:body.id,name:lead.name,email:lead.email,whatsapp:lead.whatsapp,birthYear:lead.birth_year,gender:lead.gender,languages:JSON.parse(lead.languages||"[]") as string[],selectedNadi:lead.selected_nadi||undefined,sessionAt:body.sessionAt||null,selectedTimeslot:body.sessionAt||null,stage:body.thumbprintHelp?"thumbprint_pending":body.sessionAt?"lf_scheduled":"nadi_selection_done",operations:body.reschedule?"session_rescheduled":body.thumbprintHelp?"thumbprint_help_required":undefined,thumbprintStatus:body.thumbprintHelp?"needs_help":undefined,thumbprintFeedback:body.thumbprintHelp?"Automatic quality check failed three times; care-team assistance requested.":undefined}:null;
  const crm=crmLead?await createCrmEnvelope(crmLead):null;
  if(crmLead)getRequestExecutionContext()?.waitUntil(syncLeadToCrm(crmLead).then(result=>env.DB.prepare("UPDATE leads SET crm_synced=?,crm_error=? WHERE id=?").bind(result.ok?1:0,result.error||null,body.id).run()).catch(error=>env.DB.prepare("UPDATE leads SET crm_synced=0,crm_error=? WHERE id=?").bind(error instanceof Error?error.message.slice(0,500):"CRM synchronization failed",body.id).run()));
  return Response.json({ok:true,crm,sessionSelectedAt:body.sessionAt?Date.now():null});
}
