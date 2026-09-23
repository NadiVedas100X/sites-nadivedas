"use client";
import Link from "next/link";
import {usePricing} from "./PricingProvider";
import {formatPrice,leafFindingAmount} from "../lib/pricing";

function clock(milliseconds:number){
  const seconds=Math.max(0,Math.ceil(milliseconds/1000));
  return `${String(Math.floor(seconds/60)).padStart(2,"0")}:${String(seconds%60).padStart(2,"0")}`;
}

export function LeafOfferCta(){
  const pricing=usePricing();
  const price=formatPrice(leafFindingAmount(pricing),pricing.currency);
  return <div className="leaf-offer-cta">
    <Link href="/journey" className="lux-btn">Book leaf finding — {price} <span>→</span></Link>
    {pricing.offerActive&&<div className="leaf-offer-clock" role="timer" aria-live="polite">
      <span><s>₹999</s> <b>{price}</b></span>
      <strong>{clock(pricing.offerRemaining)}</strong>
      <small>Complete payment before the timer ends. Otherwise, the price returns to ₹999.</small>
    </div>}
  </div>;
}
