import {env} from "cloudflare:workers";
import {createCrmEnvelope,syncLeadToCrm} from "../../../../lib/crm";
import {recordFunnelEvent} from "../../../analytics/route";
import {getRequestExecutionContext} from "vinext/shims/request-context";

export const runtime="edge";

function hex(bytes:ArrayBuffer){return Array.from(new Uint8Array(bytes),byte=>byte.toString(16).padStart(2,"0")).join("");}
async function accessToken(id:string,secret:string){const key=await crypto.subtle.importKey("raw",new TextEncoder().encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign"]);return hex(await crypto.subtle.sign("HMAC",key,new TextEncoder().encode(`thumbprint:${id}`)));}
function safeEqual(a:string,b:string){if(a.length!==b.length)return false;let diff=0;for(let i=0;i<a.length;i++)diff|=a.charCodeAt(i)^b.charCodeAt(i);return diff===0;}

export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params,runtime=env as unknown as {DB:D1Database;THUMBPRINTS:R2Bucket;LEAD_INGEST_SECRET?:string};
  const token=new URL(request.url).searchParams.get("token")||"";
  if(!runtime.LEAD_INGEST_SECRET||!safeEqual(token,await accessToken(id,runtime.LEAD_INGEST_SECRET)))return new Response("Unauthorized",{status:401});
  const lead=await runtime.DB.prepare("SELECT thumbprint_key FROM leads WHERE id=?").bind(id).first<{thumbprint_key:string|null}>();
  if(!lead?.thumbprint_key)return new Response("Not found",{status:404});
  const object=await runtime.THUMBPRINTS.get(lead.thumbprint_key);if(!object)return new Response("Not found",{status:404});
  const headers=new Headers();object.writeHttpMetadata(headers);headers.set("cache-control","private, max-age=300");headers.set("content-disposition","inline");headers.set("x-content-type-options","nosniff");
  return new Response(object.body,{headers});
}

export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){
  const {id}=await params;
  const runtime=env as unknown as {DB:D1Database;THUMBPRINTS:R2Bucket;LEAD_INGEST_SECRET?:string;CRM_LEADS_URL?:string};
  try{
    const lead=await runtime.DB.prepare("SELECT name,email,whatsapp,birth_year,gender,languages,selected_nadi,payment_status,visitor_id,thumbprint_key FROM leads WHERE id=? AND payment_status='success'").bind(id).first<{name:string;email:string;whatsapp:string;birth_year:number;gender:string;languages:string;selected_nadi:string;payment_status:string;visitor_id:string;thumbprint_key:string|null}>();
    if(!lead)return Response.json({error:"A confirmed payment is required before upload."},{status:403});
    const form=await request.formData(),file=form.get("thumbprint");
    if(!(file instanceof File))return Response.json({error:"Choose a clear thumb photo or ink impression."},{status:400});
    if(!["image/jpeg","image/png","image/webp"].includes(file.type))return Response.json({error:"Upload a JPG, PNG or WebP image."},{status:400});
    if(file.size<8*1024)return Response.json({error:"This image is too small to show the thumb ridges clearly."},{status:400});
    if(file.size>5*1024*1024)return Response.json({error:"The image must be 5 MB or smaller."},{status:400});
    const bytes=await file.arrayBuffer(),magic=new Uint8Array(bytes.slice(0,12));
    const jpeg=magic[0]===0xff&&magic[1]===0xd8, png=magic[0]===0x89&&magic[1]===0x50&&magic[2]===0x4e&&magic[3]===0x47, webp=String.fromCharCode(...magic.slice(8,12))==="WEBP";
    if(!jpeg&&!png&&!webp)return Response.json({error:"The selected file is not a readable image."},{status:400});
    if(!runtime.CRM_LEADS_URL||!runtime.LEAD_INGEST_SECRET)return Response.json({error:"Image verification is temporarily unavailable. Please retry; nothing was saved."},{status:503});
    const verificationBody=new FormData();verificationBody.set("thumbprint",new File([bytes],file.name,{type:file.type}));
    const verificationResponse=await fetch(`${runtime.CRM_LEADS_URL.replace(/\/$/,"")}/validate-thumbprint`,{method:"POST",headers:{"x-lead-ingest-secret":runtime.LEAD_INGEST_SECRET},body:verificationBody,signal:AbortSignal.timeout(30000)});
    const verification=await verificationResponse.json().catch(()=>({})) as {accepted?:boolean;kind?:string;ridge_quality?:string;confidence?:number;reason?:string;error?:string};
    if(!verificationResponse.ok||!verification.accepted){const unavailable=verificationResponse.status>=500;return Response.json({error:unavailable?(verification.error||"We could not verify this image right now. Please retry; nothing was saved."):(verification.reason||"This does not look like a clear thumb photo or inked thumb impression. Please choose another image."),validation:verification},{status:unavailable?503:422});}
    const extension=file.type==="image/png"?"png":file.type==="image/webp"?"webp":"jpg",key=`thumbprints/${id}/${crypto.randomUUID()}.${extension}`;
    await runtime.THUMBPRINTS.put(key,bytes,{httpMetadata:{contentType:file.type},customMetadata:{leadId:id,originalName:file.name.slice(0,120),validationKind:String(verification.kind||""),ridgeQuality:String(verification.ridge_quality||""),confidence:String(verification.confidence||"")}});
    await runtime.DB.prepare("UPDATE leads SET thumbprint_key=?,thumbprint_name=?,status='thumbprint_uploaded' WHERE id=?").bind(key,file.name.slice(0,120),id).run();
    if(lead.thumbprint_key&&lead.thumbprint_key!==key)await runtime.THUMBPRINTS.delete(lead.thumbprint_key).catch(()=>undefined);
    if(lead.visitor_id)await recordFunnelEvent("thumbprint_uploaded",lead.visitor_id,id);
    const token=runtime.LEAD_INGEST_SECRET?await accessToken(id,runtime.LEAD_INGEST_SECRET):"";
    const thumbprintUrl=token?`https://www.nadivedas.com/api/leads/${encodeURIComponent(id)}/thumbprint?token=${token}`:"";
    const crmLead={sourceLeadId:id,name:lead.name,email:lead.email,whatsapp:lead.whatsapp,birthYear:lead.birth_year,gender:lead.gender,languages:JSON.parse(lead.languages||"[]") as string[],selectedNadi:lead.selected_nadi||"",paymentStatus:lead.payment_status,stage:"thumbprint_uploaded",operations:"thumbprint_received",thumbprintStatus:"accepted",thumbprintUrl};
    const crm=await createCrmEnvelope(crmLead);
    getRequestExecutionContext()?.waitUntil(syncLeadToCrm(crmLead).then(result=>runtime.DB.prepare("UPDATE leads SET crm_synced=?,crm_error=? WHERE id=?").bind(result.ok?1:0,result.error||null,id).run()));
    return Response.json({ok:true,fileName:file.name,crm});
  }catch(error){console.error("thumbprint upload failed",error);return Response.json({error:"The upload could not be saved. Please retry—the booking remains safe."},{status:500});}
}
