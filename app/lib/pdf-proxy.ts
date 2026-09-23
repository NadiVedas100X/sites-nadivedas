const CRM='https://poojacrm.nadivedas.com/api/pdf-orders/';
export async function proxyPdf(request:Request,action:string){
 if(!['create','checkout','status','download','unsubscribe'].includes(action))return new Response('Not found',{status:404});
 if(Number(request.headers.get('content-length')||0)>20_000)return new Response('Request too large',{status:413});
 const body=await request.arrayBuffer();if(body.byteLength>20_000)return new Response('Request too large',{status:413});
 try{const r=await fetch(CRM+action,{method:'POST',headers:{'content-type':request.headers.get('content-type')||'application/json','authorization':request.headers.get('authorization')||'','idempotency-key':request.headers.get('idempotency-key')||''},body,redirect:'manual',signal:AbortSignal.timeout(25000)});const headers=new Headers({'cache-control':'private, no-store','referrer-policy':'no-referrer','x-content-type-options':'nosniff'});for(const key of ['content-type','content-disposition','location']){const value=r.headers.get(key);if(value)headers.set(key,value)}return new Response(r.body,{status:r.status,headers})}catch{return Response.json({error:'The report service is temporarily unavailable. Please try again.'},{status:503})}
}
