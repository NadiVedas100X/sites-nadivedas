import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';

test('signed CRM payload uses stored successful payment details', async()=>{
 const source=await readFile(new URL('../app/lib/crm.ts',import.meta.url),'utf8');
 const js=ts.transpile(source.replace('import { env } from "cloudflare:workers";','const env=globalThis.crmTestEnv;').replace("import {confirmPaidPreference} from './booking-preference';",'const confirmPaidPreference=async()=>null;'),{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022});
 globalThis.crmTestEnv={LEAD_INGEST_SECRET:'synthetic-only',DB:{prepare:()=>({bind:()=>({first:async()=>({payment_status:'success',payment_txnid:'SYNTHETIC-TXN',payment_amount:999,payment_currency:'INR'})})})}};
 try{
  const {createCrmEnvelope}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
  const result=await createCrmEnvelope({sourceLeadId:'synthetic',name:'Synthetic',email:'test@example.invalid',whatsapp:'',paymentAmount:1,paymentStatus:'not_started'});
  const payload=JSON.parse(result.payload);
  assert.equal(payload.paymentAmount,999);assert.equal(payload.paymentTxnid,'SYNTHETIC-TXN');assert.equal(payload.paymentCurrency,'INR');assert.equal(payload.paymentStatus,'success');assert.ok(result.signature);
 }finally{delete globalThis.crmTestEnv;}
});
