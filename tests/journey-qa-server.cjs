// Local-only QA proxy: never forwards API writes or third-party requests.
const http=require('node:http');
const startsAt=Date.now()+86400000;
http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost:3200');
 const json=data=>{res.setHeader('content-type','application/json');res.end(JSON.stringify(data));};
 if(url.pathname==='/qa/guruji-schedule')return json({slots:[{startsAt,date:new Date(startsAt).toISOString().slice(0,10),minute:600,availableCount:2}]});
 if(url.pathname==='/api/leads'){
  if(req.method==='GET')return json({lead:{paymentStatus:'success',sessionAt:startsAt,gender:'male',selectedNadi:'shiva',nadiDecided:false,thumbprintUploaded:false}});
  let body='';for await(const c of req)body+=c;
  if(req.method==='POST'){const data=JSON.parse(body);console.log('QA details interest:',data.interest);return json({id:'synthetic-browser-qa'});}
  return json({ok:true});
 }
 if(url.pathname==='/api/booking-preference'){console.log('QA preference only — no calendar mutation');return json({ok:true,reserved:false});}
 if(url.pathname.startsWith('/api/')&&url.pathname!=='/api/pricing')return json({ok:true});
 if(url.pathname.startsWith('/_next/image')){res.statusCode=204;return res.end();}
 try{
  const upstream=await fetch('http://localhost:3199'+req.url);
  res.statusCode=upstream.status;
  res.setHeader('Content-Type',upstream.headers.get('content-type')||'text/plain');
  res.setHeader('Content-Security-Policy',"default-src 'self' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' ws://localhost:3199 ws://localhost:3200; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:");
  const type=upstream.headers.get('content-type')||'';
  if(/javascript|html/.test(type))res.end((await upstream.text()).replaceAll('https://poojacrm.nadivedas.com/api/guruji-schedule?public=1','/qa/guruji-schedule').replaceAll('https://nadi-vedas-reading.pavansaih.chatgpt.site/api/guruji-schedule?public=1','/qa/guruji-schedule'));
  else res.end(Buffer.from(await upstream.arrayBuffer()));
 }catch{res.statusCode=502;res.end('QA proxy unavailable');}
}).listen(3200,'127.0.0.1',()=>console.log('Isolated QA at http://localhost:3200'));
