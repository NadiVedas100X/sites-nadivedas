import {env} from 'cloudflare:workers';
import {loadAvailability} from './live-availability';

export async function availablePreferredTime(startsAt:number){
  if(new Date(startsAt+330*60000).toISOString().slice(0,10)==='2026-09-14')return false;
  return (await loadAvailability()).some(slot=>slot.startsAt===startsAt);
}

/** A preference is not a reservation. Only a verified paid lead may advance. */
export async function confirmPaidPreference(id:string){
  const lead=await env.DB.prepare('SELECT payment_status,session_at FROM leads WHERE id=?').bind(id).first<{payment_status:string;session_at:number|null}>();
  if(!lead||lead.payment_status!=='success'||lead.session_at)return lead?.session_at||null;
  const preferred=await env.DB.prepare('SELECT starts_at FROM booking_preferences WHERE lead_id=?').bind(id).first<{starts_at:number}>().catch(()=>null);
  if(!preferred||!await availablePreferredTime(preferred.starts_at))return null;
  await env.DB.prepare("UPDATE leads SET session_at=?,session_selected_at=?,status='scheduled' WHERE id=? AND payment_status='success' AND session_at IS NULL AND (SELECT COUNT(*) FROM leads occupied WHERE occupied.session_at=? AND occupied.payment_status='success')<3").bind(preferred.starts_at,Date.now(),id,preferred.starts_at).run();
  return (await env.DB.prepare('SELECT session_at FROM leads WHERE id=?').bind(id).first<{session_at:number}>())?.session_at||null;
}
