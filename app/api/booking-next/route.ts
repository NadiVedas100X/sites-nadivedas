import { env } from 'cloudflare:workers';
import { syncLeadToCrm } from '../../lib/crm';

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get('lead') || '';
  const lead = await env.DB.prepare('SELECT * FROM leads WHERE id=?').bind(id).first<Record<string, any>>();
  if (!lead || lead.payment_status !== 'success') return Response.json({error:'Payment has not been confirmed'}, {status:409});
  const txn = `website-${id}`;
  const url = `https://lp.nadivedas.com/checkout/success?txn=${encodeURIComponent(txn)}`;
  // Reopening an old payment must not overwrite newer CRM choices or timing.
  const existing = await fetch(`https://nadi-ai.pages.dev/api/public-data?resource=fingerprint-token&txn=${encodeURIComponent(txn)}`).catch(()=>null);
  if(existing?.ok) return Response.json({url},{headers:{'cache-control':'no-store'}});
  let languages:string[]=[];
  try { languages=JSON.parse(lead.languages || '[]'); } catch {}
  const synced = await syncLeadToCrm({sourceLeadId:id,name:lead.name,email:lead.email,whatsapp:lead.whatsapp,birthYear:lead.birth_year,gender:lead.gender,languages,selectedNadi:lead.selected_nadi,paymentStatus:'success',stage:'payment',sessionAt:lead.session_at,selectedTimeslot:lead.session_at});
  const legacy = 'destinations' in synced ? synced.destinations?.find(result=>new URL(result.url).hostname==='nadi-ai.pages.dev') : null;
  if (!legacy?.ok) return Response.json({error:'Preparing your booking. Please try again shortly.'}, {status:503});
  return Response.json({url},{headers:{'cache-control':'no-store'}});
}
