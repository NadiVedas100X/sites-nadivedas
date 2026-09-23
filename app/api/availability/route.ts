import {loadAvailability} from '../../lib/live-availability';
export async function GET(){
  try{return Response.json({slots:await loadAvailability(),refreshedAt:Date.now()},{headers:{'cache-control':'public, max-age=15, s-maxage=15, stale-while-revalidate=30'}});}
  catch{return Response.json({error:'Could not load available times. Please retry.'},{status:503});}
}
