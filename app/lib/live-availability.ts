export async function loadAvailability(){
  const now=Date.now(),day=(stamp:number)=>new Date(stamp+330*60000).toISOString().slice(0,10);
  const url=`https://nadi-ai.pages.dev/api/public-data?resource=available-slots&date_from=${day(now+86400000)}&date_to=${day(now+45*86400000)}&service_block=leaf`;
  const response=await fetch(url,{cache:'no-store',signal:AbortSignal.timeout(8000)});
  if(!response.ok)throw new Error('Availability unavailable');
  const data=await response.json() as {data?:{slots?:Array<{date:string;time:string;available:number}>}};
  if(!Array.isArray(data.data?.slots))throw new Error('Invalid slots');
  return data.data.slots.map(slot=>({date:slot.date,minute:Number(slot.time.slice(0,2))*60+Number(slot.time.slice(3,5)),startsAt:Date.parse(`${slot.date}T${slot.time}:00+05:30`),availableCount:Math.min(3,slot.available)})).filter(slot=>slot.startsAt>=now+86400000&&slot.availableCount>0&&slot.date!=='2026-09-14');
}
