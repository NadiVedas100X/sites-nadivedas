import test from 'node:test';import assert from 'node:assert/strict';import{readFile}from'node:fs/promises';import ts from'typescript';
test('unpaid preference never books; unavailable paid preference stays unbooked',async()=>{
 const source=await readFile(new URL('../app/lib/booking-preference.ts',import.meta.url),'utf8');
 const js=ts.transpile(source
  .replace("import {env} from 'cloudflare:workers';",'const env=globalThis.bookingTest;')
  .replace("import {loadAvailability} from './live-availability';",'const loadAvailability=async()=>{const data=await (await fetch("https://synthetic.invalid/availability")).json();return data.slots||[];};'),{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022});
 let paid=false,writes=0,session=null,available=false;
 globalThis.bookingTest={DB:{prepare(sql){return{bind(){return{async first(){return sql.includes('booking_preferences')?{starts_at:123}:{payment_status:paid?'success':'pending',session_at:session}},async run(){writes++;session=123;}}}}}}};
 const original=globalThis.fetch;globalThis.fetch=async()=>Response.json({slots:available?[{startsAt:123,availableCount:1}]:[]});
 try{const {confirmPaidPreference}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));assert.equal(await confirmPaidPreference('synthetic'),null);assert.equal(writes,0);paid=true;assert.equal(await confirmPaidPreference('synthetic'),null);assert.equal(writes,0);available=true;assert.equal(await confirmPaidPreference('synthetic'),123);assert.equal(writes,1);await confirmPaidPreference('synthetic');assert.equal(writes,1);}finally{globalThis.fetch=original;delete globalThis.bookingTest;}
});
