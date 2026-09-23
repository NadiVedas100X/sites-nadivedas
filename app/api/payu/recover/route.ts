import { recoverPayuPayment } from "../../../lib/payu-recovery";
import { env } from "cloudflare:workers";
import { syncLeadToCrm } from "../../../lib/crm";
import { getRequestExecutionContext } from "vinext/shims/request-context";

async function deliverPaidLead(id:string) {
  const lead=await env.DB.prepare("SELECT name,email,whatsapp,birth_year,gender,languages,selected_nadi,session_at FROM leads WHERE id=? AND payment_status='success'").bind(id).first<{name:string;email:string;whatsapp:string;birth_year:number;gender:string;languages:string;selected_nadi:string;session_at:number|null}>();
  if(!lead)return;
  const result=await syncLeadToCrm({sourceLeadId:id,name:lead.name,email:lead.email,whatsapp:lead.whatsapp,birthYear:lead.birth_year,gender:lead.gender,languages:JSON.parse(lead.languages||"[]"),selectedNadi:lead.selected_nadi,sessionAt:lead.session_at,paymentStatus:"success",stage:lead.session_at?"lf_scheduled":"lf_paid"});
  await env.DB.prepare("UPDATE leads SET crm_synced=?,crm_error=? WHERE id=?").bind(result.ok?1:0,result.error||null,id).run();
}

export async function POST(request:Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return new Response("Forbidden",{status:403});
  let leadId:string;
  try { const data=await request.json(); leadId=String(data.leadId||""); } catch { return new Response("Invalid request",{status:400}); }
  if (!/^[a-f0-9-]{36}$/i.test(leadId)) return new Response("Invalid reference",{status:400});
  try {
    const status=await recoverPayuPayment(leadId);
    if(status==="success")getRequestExecutionContext()?.waitUntil(deliverPaidLead(leadId).catch(()=>console.error("Recovered payment CRM delivery failed")));
    return Response.json({status},{headers:{"cache-control":"no-store"}});
  }
  catch (error) { console.error("PayU recovery unavailable",{reason:error instanceof Error ? error.message : "unknown"}); return Response.json({status:"unavailable",message:"We could not confirm the payment yet. If money was debited, do not pay again. Please contact support with your order ID."},{status:503,headers:{"cache-control":"no-store"}}); }
}
