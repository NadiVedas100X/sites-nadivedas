"use client";
import {createContext,useContext,useEffect,useMemo,useState} from "react";
import {formatPrice,INDIA_PROFILE,leafFindingAmount,localizedNadiAmount,parseInr,type PricingProfile} from "../lib/pricing";

const OFFER_DURATION_MS=9*60*1000;
const OFFER_STORAGE_KEY="nadivedas-leaf-offer-start";
export type ActivePricingProfile=PricingProfile&{offerActive:boolean;offerRemaining:number;offerStartedAt:number};
const PricingContext=createContext<ActivePricingProfile>({...INDIA_PROFILE,offerActive:false,offerRemaining:0,offerStartedAt:0});
export const usePricing=()=>useContext(PricingContext);

function replacePrices(root:HTMLElement,profile:PricingProfile){
  if(profile.region==="india")return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  const nodes:Text[]=[];let node:Node|null;
  while((node=walker.nextNode()))if(node.parentElement&&!node.parentElement.closest("script,style,[data-no-geo-price]")&&/₹\s*[\d,]+/.test(node.nodeValue||""))nodes.push(node as Text);
  for(const text of nodes){
    const original=text.nodeValue||"";
    text.parentElement?.classList.add("localized-currency-price");
    text.nodeValue=original.replace(/₹\s*([\d,]+)/g,(_,raw:string)=>{
      const inr=parseInr(raw);const amount=[999,1001,1500].includes(inr)?leafFindingAmount(profile):localizedNadiAmount(inr,profile);
      return formatPrice(amount,profile.currency);
    });
  }
}

export function PricingProvider({children}:{children:React.ReactNode}){
  const [profile,setProfile]=useState<PricingProfile>(INDIA_PROFILE);
  const [offerStartedAt,setOfferStartedAt]=useState(0);
  const [now,setNow]=useState(0);
  useEffect(()=>{
    const stored=Number(window.localStorage.getItem(OFFER_STORAGE_KEY));
    const started=Number.isFinite(stored)&&stored>0?stored:Date.now();
    if(!stored)window.localStorage.setItem(OFFER_STORAGE_KEY,String(started));
    setOfferStartedAt(started);setNow(Date.now());
    const timer=window.setInterval(()=>setNow(Date.now()),1000);
    return()=>window.clearInterval(timer);
  },[]);
  useEffect(()=>{let active=true;fetch(`/api/pricing?v=${Date.now()}`,{credentials:"same-origin",cache:"no-store"}).then(r=>r.ok?r.json():null).then(p=>{if(active&&p){setProfile(p);document.documentElement.dataset.pricingCountry=p.country;document.documentElement.dataset.pricingCurrency=p.currency}}).catch(()=>{});return()=>{active=false}},[]);
  useEffect(()=>{if(profile.region==="india")return;replacePrices(document.body,profile);const observer=new MutationObserver(()=>replacePrices(document.body,profile));observer.observe(document.body,{subtree:true,childList:true,characterData:true});return()=>observer.disconnect()},[profile]);
  const offerRemaining=Math.max(0,OFFER_DURATION_MS-Math.max(0,now-offerStartedAt));
  const offerActive=profile.region==="india"&&offerStartedAt>0&&offerRemaining>0;
  const value=useMemo<ActivePricingProfile>(()=>({...profile,leafFinding:offerActive?540:profile.leafFinding,offerActive,offerRemaining,offerStartedAt}),[profile,offerActive,offerRemaining,offerStartedAt]);
  return <PricingContext.Provider value={value}>{children}</PricingContext.Provider>;
}
