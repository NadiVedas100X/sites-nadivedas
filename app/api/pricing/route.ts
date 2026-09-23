import {pricingForRequest} from "../../lib/server-pricing";

export async function GET(request:Request){
  const profile=await pricingForRequest(request);
  return Response.json(profile,{headers:{"cache-control":"private, no-store, max-age=0","vary":"CF-IPCountry, X-Vercel-IP-Country"}});
}
