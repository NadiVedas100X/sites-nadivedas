// Isolated browser QA. Every API mutation and third-party request is intercepted.
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'chrome',headless:true});
 try{for(const width of [390,1440]){
  const context=await browser.newContext({viewport:{width,height:900}});
  let details=null,preference=null,paid=false;const mutations=[];
  const startsAt=Date.now()+86400000;const date=new Date(startsAt).toISOString().slice(0,10);
  await context.route('**/*',async route=>{
   const request=route.request(),url=new URL(request.url());
   if(url.pathname.includes('guruji-schedule'))return route.fulfill({json:{slots:[{startsAt,date,minute:600,availableCount:2}]}});
   if(url.hostname!=='localhost')return route.abort();
   if(url.pathname==='/api/pricing')return route.fulfill({json:{country:'IN',region:'india',currency:'INR',rateFromInr:1,nadiMultiplier:1,leafFinding:999,updatedAt:0}});
   if(['/_next/image','/_vinext/image'].includes(url.pathname))return route.fulfill({status:204,body:''});
   if(url.pathname==='/api/leads'){
    if(request.method()==='POST'){details=request.postDataJSON();mutations.push('details');return route.fulfill({json:{id:'synthetic-browser-qa',ok:true}});}
    if(request.method()==='GET')return route.fulfill({json:{lead:{paymentStatus:paid?'success':'pending',sessionAt:paid?startsAt:null,gender:'male',selectedNadi:'shiva',nadiDecided:false,thumbprintUploaded:false}}});
    if(request.method()==='PATCH'&&paid&&request.postDataJSON().nadi){mutations.push('nadi-choice');return route.fulfill({json:{ok:true}});}
    mutations.push('unexpected-lead-write');return route.abort();
   }
   if(url.pathname==='/api/booking-preference'){preference=request.postDataJSON();mutations.push('preference');return route.fulfill({json:{ok:true,reserved:false}});}
   if(url.pathname==='/api/leads/synthetic-browser-qa/thumbprint'){assert.equal(paid,true);mutations.push('thumbprint');return route.fulfill({json:{ok:true,fileName:'SYNTHETIC-QA.png'}});}
   if(url.pathname.startsWith('/api/'))return route.fulfill({json:{ok:true}});
   return route.continue();
  });
  const page=await context.newPage();await page.goto('http://localhost:3199/journey?interest=shiva');
  await page.getByRole('button',{name:'Continue to leaf finding'}).click();assert.equal(details,null,'empty form must not submit');
  await page.locator('[name="name"]').fill('SYNTHETIC QA');await page.locator('[name="birthYear"]').fill('1990');
  await page.locator('[name="email"]').fill('qa@example.invalid');await page.locator('[name="gender"]').selectOption('male');
  await page.locator('[name="whatsapp"]').fill('9000000000');await page.locator('[name="state"]').selectOption({label:'Telangana'});
  await page.locator('label').filter({has:page.locator('[name="languages"][value="English"]')}).click();await page.locator('[name="followupConsent"]').check();
  await page.getByRole('button',{name:'Continue to leaf finding'}).click();
  await page.getByRole('heading',{name:'Select time',exact:true}).waitFor();assert.equal(details.interest,'shiva');
  await page.locator('.journey-time-picker button').first().click();await page.getByRole('button',{name:/^Continue to payment/}).click();
  await page.getByRole('heading',{name:'Start your index-leaf search.'}).waitFor();assert.equal(preference.startsAt,startsAt);assert.deepEqual(mutations,['details','preference']);
  paid=true;await page.goto('http://localhost:3199/journey?lead=synthetic-browser-qa&payment=success&interest=shiva');
  await page.getByText('Step 4 · Thumb impression',{exact:true}).waitFor();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),true,'no horizontal overflow');
  // Artificial checkerboard exercises local image validation; it is not a real
  // thumbprint and cannot leave this intercepted, local-only test context.
  const fixture=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=384;const x=c.getContext('2d');for(let y=0;y<384;y+=6)for(let z=0;z<384;z+=6){x.fillStyle=((y+z)/6)%2?'#333':'#bbb';x.fillRect(z,y,6,6);}return c.toDataURL('image/png').split(',')[1];});
  await page.locator('input[type=file]').last().setInputFiles({name:'SYNTHETIC-QA.png',mimeType:'image/png',buffer:Buffer.from(fixture,'base64')});
  await page.getByRole('button',{name:'Yes, right thumb',exact:true}).click();
  await page.getByRole('button',{name:/^Confirm thumbprint/}).click();
  await page.getByRole('heading',{name:'Choose where Guruji should search.'}).waitFor();
  await page.getByRole('button',{name:/^Help me choose/}).click();
  await page.locator('.answer-grid button').first().waitFor();
  for(let question=0;question<10&&await page.locator('.answer-grid button').count();question++){
   const prior=await page.locator('.discovery-count').textContent();
   await page.locator('.answer-grid button').first().click();
   await page.waitForFunction(prior=>document.querySelector('.discovery-count')?.textContent!==prior,prior);
  }
  await page.locator('.recommendation .confirm-nadi').click();
  await page.getByRole('heading',{name:'Your journey is registered.'}).waitFor();
  assert.deepEqual(mutations,['details','preference','thumbprint','nadi-choice']);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+2),true,'confirmation has no horizontal overflow');
  console.log(`PASS ${width}px: validation, interest, details→time→payment, no unpaid calendar write, paid→thumbprint→Nadi→confirmation`);
  await context.close();
 }}finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
