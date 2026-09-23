export type PricingCurrency="INR"|"USD"|"SGD"|"MYR";
export type PricingRegion="india"|"international"|"singapore"|"malaysia";
export type PricingProfile={country:string;region:PricingRegion;currency:PricingCurrency;rateFromInr:number;nadiMultiplier:number;leafFinding:number;updatedAt:number};

export const INDIA_PROFILE:PricingProfile={country:"IN",region:"india",currency:"INR",rateFromInr:1,nadiMultiplier:1,leafFinding:999,updatedAt:0};
export const FALLBACK_RATES:Record<PricingCurrency,number>={INR:1,USD:0.010444,SGD:0.013314,MYR:0.042357};

export function countryFromRequest(request:Request){
  return (request.headers.get("cf-ipcountry")||request.headers.get("x-vercel-ip-country")||request.headers.get("x-country-code")||"IN").trim().toUpperCase();
}

export function profileForCountry(country:string,rates:Partial<Record<PricingCurrency,number>>=FALLBACK_RATES):PricingProfile{
  const code=country.toUpperCase();
  if(code==="IN")return {...INDIA_PROFILE,updatedAt:Date.now()};
  const currency:PricingCurrency=code==="SG"?"SGD":code==="MY"?"MYR":"USD";
  const region:PricingRegion=code==="SG"?"singapore":code==="MY"?"malaysia":"international";
  const rate=Number(rates[currency])||FALLBACK_RATES[currency];
  return {country:code,region,currency,rateFromInr:rate,nadiMultiplier:region==="international"?1.5:1.25,leafFinding:region==="international"?99:Math.round(5000*rate),updatedAt:Date.now()};
}

export function leafFindingAmount(profile:PricingProfile,nadiId=""){
  if(profile.region!=="india")return profile.leafFinding;
  if(!nadiId&&profile.leafFinding>0&&profile.leafFinding<999)return profile.leafFinding;
  return nadiId==="brahma"?1500:nadiId?1001:999;
}

export function localizedNadiAmount(inr:number,profile:PricingProfile){return Math.round(inr*profile.nadiMultiplier*profile.rateFromInr)}
export function parseInr(value:string|number){return typeof value==="number"?value:Number(value.replace(/[^0-9.]/g,""))||0}
export function formatPrice(amount:number,currency:PricingCurrency){
  if(currency==="SGD")return `S$${new Intl.NumberFormat("en-SG",{maximumFractionDigits:0}).format(amount)}`;
  return new Intl.NumberFormat(currency==="INR"?"en-IN":currency==="MYR"?"en-MY":"en-US",{style:"currency",currency,maximumFractionDigits:0}).format(amount);
}
