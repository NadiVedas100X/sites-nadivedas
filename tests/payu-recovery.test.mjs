import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';

test('PayU recovery accepts only the stored, captured transaction and exact amount',async()=>{
 const source=await readFile(new URL('../app/lib/payu-recovery.ts',import.meta.url),'utf8');
 const js=ts.transpile(source.replace('import { env } from "cloudflare:workers";','const env=globalThis.testPayuEnv;'),{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022});
 let writes=0,calls=0;
 const lead={payment_status:'initiated',payment_txnid:'SYNTHETIC-PAYU',payment_amount:999,payment_currency:'INR'};
 globalThis.testPayuEnv={PAYU_KEY:'synthetic',PAYU_SALT:'synthetic',DB:{prepare:()=>({bind:()=>({first:async()=>lead,run:async()=>{writes++;return {success:true}}})})}};
 const {recoverPayuPayment}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
 const original=globalThis.fetch;
 let payment={txnid:'SYNTHETIC-PAYU',status:'success',unmappedstatus:'captured',amt:'999.00'};
 globalThis.fetch=async()=>{calls++;return Response.json({transaction_details:{'SYNTHETIC-PAYU':payment}})};
 try {
  assert.equal(await recoverPayuPayment('synthetic-lead'),'success');assert.equal(writes,1);
  payment={...payment,amt:'1.00'};await assert.rejects(()=>recoverPayuPayment('synthetic-lead'),/mismatch/);assert.equal(writes,1);
  payment={...payment,amt:'999.00',txnid:'other'};await assert.rejects(()=>recoverPayuPayment('synthetic-lead'),/incomplete/);
  payment={txnid:'SYNTHETIC-PAYU',status:'pending',unmappedstatus:'pending'};assert.equal(await recoverPayuPayment('synthetic-lead'),'pending');assert.equal(writes,1);
  payment={...payment,status:'failure',unmappedstatus:'failed'};assert.equal(await recoverPayuPayment('synthetic-lead'),'failure');assert.equal(writes,1);
  lead.payment_status='success';const before=calls;assert.equal(await recoverPayuPayment('synthetic-lead'),'success');assert.equal(calls,before);
 }finally {globalThis.fetch=original;delete globalThis.testPayuEnv;}
});

test('callback returns without waiting for tracking, and a failed callback cannot downgrade paid',async()=>{
 const source=await readFile(new URL('../app/api/payu/callback/route.ts',import.meta.url),'utf8');
 const js=ts.transpile(source.replace(/^import .*;\n/gm,''),{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}).replace('export async function POST','async function POST');
 let paid=false;const jobs=[];
 const DB={prepare(sql){return {bind(...values){return {async run(){assert.match(sql,/payment_status!='success'/);if(!paid)paid=values[0]==='success';},async first(){return sql.includes('visitor_id')?{visitor_id:'synthetic',name:'Test',email:'test@example.invalid',whatsapp:'',selected_nadi:''}:{selected_nadi:'',payment_status:paid?'success':'failure'};}}}}}};
 const exclusions=ts.transpile(await readFile(new URL('../app/lib/tracking-exclusions.ts',import.meta.url),'utf8'),{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022}).replace('export function isInternalTestIdentity','function isInternalTestIdentity');
 const isInternalTestIdentity=new Function(exclusions+';return isInternalTestIdentity')();
 const POST=new Function('env','recordFunnelEvent','sendVerifiedMetaPurchase','sendTikTokServerEvent','getRequestExecutionContext','syncLeadToCrm','isInternalTestIdentity',js+';return POST')({DB,PAYU_SALT:'synthetic'},async()=>{},()=>new Promise(()=>{}),async()=>{},()=>({waitUntil:p=>jobs.push(p)}),async()=>({ok:true}),isInternalTestIdentity);
 const call=async(status)=>{
  const form=new URLSearchParams({status,udf1:'synthetic',txnid:'synthetic',key:'synthetic',email:'',firstname:'',productinfo:'',amount:'999'});
  const base=`synthetic|${status}||||||||||synthetic||||999|synthetic|synthetic`;
  form.set('hash',Buffer.from(await crypto.subtle.digest('SHA-512',new TextEncoder().encode(base))).toString('hex'));
  return POST(new Request('https://example.invalid/api/payu/callback',{method:'POST',body:form}));
 };
 const result=await Promise.race([call('success'),new Promise((_,reject)=>setTimeout(()=>reject(Error('redirect blocked')),500))]);
 assert.equal(result.status,303);assert.match(result.headers.get('location'),/payment=success/);assert.equal(jobs.length,1);
 const failed=await call('failure');assert.match(failed.headers.get('location'),/payment=success/);assert.equal(paid,true);
});
