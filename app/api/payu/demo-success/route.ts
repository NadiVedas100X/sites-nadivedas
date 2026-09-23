import { env } from "cloudflare:workers";
export async function POST(request:Request){
  const runtime=env as unknown as {DB:D1Database;PAYU_KEY?:string;PAYU_SALT?:string};
  if(runtime.PAYU_KEY&&runtime.PAYU_SALT)return new Response("Demo checkout is disabled",{status:404});
  const form=await request.formData();const lead=String(form.get("lead")||"");
  if(lead)await runtime.DB.prepare("UPDATE leads SET payment_status='demo_success', status='paid_demo' WHERE id=?").bind(lead).run();
  const next=new URL("/journey",request.url);next.searchParams.set("payment","success");if(lead)next.searchParams.set("lead",lead);return Response.redirect(next,303);
}
