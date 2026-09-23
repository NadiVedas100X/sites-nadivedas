import {env} from 'cloudflare:workers';
import {syncLeadToCrm} from '../../lib/crm';
function same(a:string,b:string){if(a.length!==b.length)return false;let d=0;for(let i=0;i<a.length;i++)d|=a.charCodeAt(i)^b.charCodeAt(i);return d===0}
export async function POST(request:Request){
 const e=env as unknown as {DB:D1Database;LEAD_INGEST_SECRET?:string};
 if(!e.LEAD_INGEST_SECRET||!same(request.headers.get('x-lead-ingest-secret')||'',e.LEAD_INGEST_SECRET))return new Response('Unauthorized',{status:401});
 const b=await request.json() as Record<string,string>;if(!/^[a-f0-9-]{36}$/.test(b.orderId||'')||!b.name||!b.email||!b.phone)return new Response('Invalid entitlement',{status:400});
 const id=`pdf-${b.orderId}`,now=Date.now();
 await e.DB.prepare("INSERT OR IGNORE INTO leads(id,name,email,whatsapp,birth_year,gender,languages,selected_nadi,status,payment_status,payment_txnid,payment_amount,payment_currency,leaf_finding_amount,followup_consent,consent_at,visitor_id,state,country,created_at) VALUES(?,?,?,?,?,?,?,'','paid','success',?,0,'INR',0,1,?,?,'','',?)").bind(id,b.name,b.email,b.phone,Number(b.birthDate?.slice(0,4)),b.gender,JSON.stringify([b.language]),`included-${b.orderId}`,now,id,now).run();
 const result=await syncLeadToCrm({sourceLeadId:id,name:b.name,email:b.email,whatsapp:b.phone,birthYear:Number(b.birthDate?.slice(0,4)),gender:b.gender,languages:[b.language],paymentStatus:'success',paymentAmount:0,paymentCurrency:'INR',paymentProvider:'pdf_bundle_included',paymentTxnid:`included-${b.orderId}`,stage:'payment',followupConsent:true,consentAt:now,landingUrl:'https://www.nadivedas.com/pdf-reports',operations:'Leaf finding included with paid PDF report. No separate leaf-finding payment.'});
 await e.DB.prepare('UPDATE leads SET crm_synced=?,crm_error=? WHERE id=?').bind(result.ok?1:0,result.error||null,id).run();
 if(!result.ok)return Response.json({error:'Booking synchronization pending'},{status:503});
 return Response.json({leadId:id},{headers:{'cache-control':'no-store'}});
}
