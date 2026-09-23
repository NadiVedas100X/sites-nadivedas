import test from 'node:test';import assert from 'node:assert/strict';import{readFile}from'node:fs/promises';import ts from'typescript';
const source=await readFile(new URL('../app/lib/audience-stages.ts',import.meta.url),'utf8');
const mod=await import('data:text/javascript;base64,'+Buffer.from(ts.transpile(source,{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ES2022})).toString('base64'));
const base={detailsSubmitted:true,payment:'success',thumbprintUploaded:false,nadiDecided:false,lfDone:false,leafConfirmed:null,frDecided:null,frPaid:null,pujaPaid:null,scheduledAt:100};
test('AND filters and overdue stages',()=>{assert.equal(mod.matchesAudience(base,['payment_success','lf_not_done','lf_overdue'],200),true);assert.equal(mod.matchesAudience(base,['payment_success','leaf_confirmed'],200),false)});
test('unknown outcomes are not unpaid or negative',()=>{const stages=mod.audienceStages(base,200);assert.ok(!stages.includes('fr_unpaid'));assert.ok(!stages.includes('leaf_not_confirmed'))});
test('updated facts remove obsolete membership',()=>{const stages=mod.audienceStages({...base,thumbprintUploaded:true,nadiDecided:true,lfDone:true,leafConfirmed:true,frPaid:true},200);for(const s of ['thumbprint_missing','nadi_undecided','lf_not_done','lf_overdue','payment_failed','fr_unpaid'])assert.ok(!stages.includes(s));assert.ok(stages.includes('fr_paid'))});
test('owner test number excluded in both formats',()=>{for(const phone of ['+91 77996 39692','7799639692'])assert.deepEqual(mod.audienceStages({...base,phone}),[])});
test('failed payment is not paid-session audience',()=>{assert.deepEqual(mod.audienceStages({...base,payment:'failed',scheduledAt:null}),['payment_failed'])});
