import {proxyPdf} from '../../lib/pdf-proxy';
export async function POST(request:Request){return proxyPdf(request,'create')}

export async function GET(){try{const r=await fetch('https://poojacrm.nadivedas.com/api/pdf-orders/config',{cache:'no-store',signal:AbortSignal.timeout(6000)});if(!r.ok)throw Error();return Response.json(await r.json(),{headers:{'cache-control':'no-store'}})}catch{return Response.json({salesEnabled:false},{headers:{'cache-control':'no-store'}})}}
