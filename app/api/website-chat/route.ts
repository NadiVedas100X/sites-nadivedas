const origin="https://nadi-ai.pages.dev/api/website-chat";
const fallback={messages:["I am here and ready to guide you.","I can explain the Leaf Finding process, help you choose a Nadi, show real video reviews, or guide you to the correct payment step. What would you like to explore?"],intent:"continue_guidance",suggested_action:"explore_nadis",media:[]};

function wait(ms:number){return new Promise(resolve=>setTimeout(resolve,ms))}
function retryable(status:number){return status===408||status===429||status>=500}

async function upstream(init?:RequestInit){
  let response:Response|undefined;
  let failure:unknown;
  for(let attempt=0;attempt<3;attempt+=1){
    try{response=await fetch(origin,{cache:"no-store",...init});if(!retryable(response.status))return response}
    catch(error){failure=error}
    if(attempt<2)await wait(attempt?800:250);
  }
  if(response)return response;
  throw failure||new Error("Chat request failed");
}

async function normalizedResponse(response:Response){
  const text=await response.text();
  const contentType=response.headers.get("content-type")||"";
  if(contentType.includes("application/json")){
    try{JSON.parse(text);return new Response(text,{status:response.status,headers:{"content-type":"application/json","cache-control":"no-store"}})}catch{}
  }
  const status=response.ok?502:response.status;
  const message="The chat request could not be completed. Please try again.";
  return Response.json({error:message},{status,headers:{"cache-control":"no-store"}});
}

export async function GET(){
  const response=await upstream();
  return normalizedResponse(response);
}

export async function POST(request:Request){
  const body=await request.text();
  let action="";
  try{action=String(JSON.parse(body)?.action||"")}catch{}
  try{
    const response=await upstream({method:"POST",headers:{"content-type":"application/json",...(request.headers.get("authorization")?{authorization:request.headers.get("authorization")!}:{})},body});
    if(action==="chat"&&retryable(response.status)&&!(response.headers.get("content-type")||"").includes("application/json"))return Response.json({data:fallback},{headers:{"cache-control":"no-store"}});
    return await normalizedResponse(response);
  }catch{
    if(action==="chat")return Response.json({data:fallback},{headers:{"cache-control":"no-store"}});
    return Response.json({error:"The chat request could not be completed. Please try again."},{status:502,headers:{"cache-control":"no-store"}});
  }
}
