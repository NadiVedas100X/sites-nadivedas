import {countryFromRequest,FALLBACK_RATES,profileForCountry,type PricingCurrency} from "./pricing";

let cached:{rates:Partial<Record<PricingCurrency,number>>;expires:number}|null=null;
export async function pricingForRequest(request:Request){
  const country=countryFromRequest(request);
  if(country==="IN")return profileForCountry(country);
  if(!cached||cached.expires<Date.now()){
    try{
      const response=await fetch("https://open.er-api.com/v6/latest/INR",{signal:AbortSignal.timeout(1800),headers:{accept:"application/json"}});
      const data=await response.json() as {result?:string;rates?:Partial<Record<PricingCurrency,number>>};
      if(!response.ok||data.result!=="success"||!data.rates)throw new Error("FX unavailable");
      cached={rates:data.rates,expires:Date.now()+60*60*1000};
    }catch{cached={rates:FALLBACK_RATES,expires:Date.now()+5*60*1000}}
  }
  return profileForCountry(country,cached.rates);
}
