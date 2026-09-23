import {env} from 'cloudflare:workers';
import {availablePreferredTime} from '../../lib/booking-preference';
export async function POST(request:Request){
  if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Forbidden'},{status:403});
  try{
    const body=await request.json() as {leadId?:string;startsAt?:number};
    if(!body.leadId||!Number.isFinite(body.startsAt)||Number(body.startsAt)<=Date.now())return Response.json({error:'Choose a future time.'},{status:400});
    const lead=await env.DB.prepare('SELECT id FROM leads WHERE id=?').bind(body.leadId).first();
    if(!lead)return Response.json({error:'Booking not found'},{status:404});
    if(!await availablePreferredTime(Number(body.startsAt)))return Response.json({error:'This time is no longer available. Choose another time.'},{status:409});
    await env.DB.prepare('CREATE TABLE IF NOT EXISTS booking_preferences (lead_id TEXT PRIMARY KEY,starts_at INTEGER NOT NULL,updated_at INTEGER NOT NULL)').run();
    await env.DB.prepare('INSERT INTO booking_preferences(lead_id,starts_at,updated_at) VALUES(?,?,?) ON CONFLICT(lead_id) DO UPDATE SET starts_at=excluded.starts_at,updated_at=excluded.updated_at').bind(body.leadId,body.startsAt,Date.now()).run();
    return Response.json({ok:true,reserved:false});
  }catch{return Response.json({error:'Unable to check availability. Please retry.'},{status:503});}
}
