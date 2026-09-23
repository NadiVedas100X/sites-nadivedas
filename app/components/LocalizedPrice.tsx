"use client";
import {formatPrice,leafFindingAmount,localizedNadiAmount,parseInr} from "../lib/pricing";
import {usePricing} from "./PricingProvider";

export function LocalizedPrice({inr,kind="nadi",nadiId="",className}:{inr:string|number;kind?:"leaf"|"nadi";nadiId?:string;className?:string}){
  const profile=usePricing();
  const amount=kind==="leaf"?leafFindingAmount(profile,nadiId):localizedNadiAmount(parseInr(inr),profile);
  return <span className={className} data-localized-price={profile.currency}>{formatPrice(amount,profile.currency)}</span>;
}
