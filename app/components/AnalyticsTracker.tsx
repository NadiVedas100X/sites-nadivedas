"use client";

import {useEffect} from "react";

const VISITOR_KEY="nadivedas-visitor-id";
const SESSION_KEY="nadivedas-session-id";
const SESSION_AT_KEY="nadivedas-session-at";
const SESSION_TTL=30*60*1000;

function persistentId(key:string){let id=localStorage.getItem(key);if(!id){id=crypto.randomUUID();localStorage.setItem(key,id)}return id}
export function visitorId(){const cookieName="nv_vid",fromCookie=document.cookie.split(";").map(part=>part.trim()).find(part=>part.startsWith(`${cookieName}=`))?.slice(cookieName.length+1);let id=fromCookie?decodeURIComponent(fromCookie):persistentId(VISITOR_KEY);localStorage.setItem(VISITOR_KEY,id);const domain=location.hostname==="nadivedas.com"||location.hostname.endsWith(".nadivedas.com")?"; Domain=.nadivedas.com":"";document.cookie=`${cookieName}=${encodeURIComponent(id)}; Path=/; Max-Age=31536000; SameSite=Lax; Secure${domain}`;return id}
export function metaAttribution(){const cookies=Object.fromEntries(document.cookie.split(";").map(part=>part.trim().split(/=(.*)/s).slice(0,2)).filter(pair=>pair[0]));const query=new URLSearchParams(location.search),fbclid=query.get("fbclid")||"",incomingTtclid=query.get("ttclid")||"";if(incomingTtclid)sessionStorage.setItem("nadivedas-ttclid",incomingTtclid);return {metaFbp:cookies._fbp||"",metaFbc:cookies._fbc||(fbclid?`fb.1.${Date.now()}.${fbclid}`:""),tiktokTtp:cookies._ttp||"",tiktokTtclid:incomingTtclid||sessionStorage.getItem("nadivedas-ttclid")||""}}
function sessionId(){const now=Date.now(),last=Number(localStorage.getItem(SESSION_AT_KEY)||0);let id=localStorage.getItem(SESSION_KEY);if(!id||now-last>SESSION_TTL){id=crypto.randomUUID();localStorage.setItem(SESSION_KEY,id)}localStorage.setItem(SESSION_AT_KEY,String(now));return id}
function campaign(){const query=new URLSearchParams(location.search);return {utmSource:query.get("utm_source")||"",utmMedium:query.get("utm_medium")||"",utmCampaign:query.get("utm_campaign")||"",utmContent:query.get("utm_content")||"",utmTerm:query.get("utm_term")||"",gclid:query.get("gclid")||"",fbclid:query.get("fbclid")||""}}
function device(){return matchMedia("(max-width: 767px)").matches?"mobile":matchMedia("(max-width: 1100px)").matches?"tablet":"desktop"}

type EventData=Record<string,string|number|boolean|undefined>;
export function track(event:string,leadId="",path=location.pathname,data:EventData={}){const body=JSON.stringify({id:crypto.randomUUID(),createdAt:Date.now(),visitorId:visitorId(),sessionId:sessionId(),event,leadId,path,referrer:document.referrer||"",title:document.title,device:device(),screen:`${screen.width}x${screen.height}`,...campaign(),...data});if(navigator.sendBeacon)navigator.sendBeacon("/api/analytics",new Blob([body],{type:"application/json"}));else void fetch("/api/analytics",{method:"POST",headers:{"content-type":"application/json"},body,keepalive:true});void fetch("https://poojacrm.nadivedas.com/api/funnel-events",{method:"POST",headers:{"content-type":"application/json"},body,mode:"cors",keepalive:true}).catch(()=>undefined)}

declare global { interface Window { fbq?: (...args: unknown[]) => void; ttq?: {identify?:(data:Record<string,string>)=>void;track?:(event:string,data?:Record<string,unknown>,options?:Record<string,string>)=>void} } }
export function trackMeta(event:string,data:EventData={}){window.fbq?.("track",event,data)}
export function trackMetaCustom(event:string,data:EventData={}){
 // Meta currently classifies nadivedas.com as Religion (core setup).
 // Keep detailed spiritual-service stages first-party; do not disguise them
 // as generic events to evade the data-source restriction.
 track(event,String(data.lead_id||""),location.pathname,data);
}

// RBI/FBIL reference rate on 6 August 2026. TikTok reporting is deliberately
// normalized to USD while PayU continues to charge the customer in INR.
const INR_PER_USD=95.2053;
export function leafFindingInr(nadi=""){return nadi==="brahma"?1500:nadi?1001:999}
export function tikTokUsd(inr:number){return Number((inr/INR_PER_USD).toFixed(2))}
export function trackTikTok(event:string,data:Record<string,unknown>={},eventId=""){window.ttq?.track?.(event,data,eventId?{event_id:eventId}:undefined)}
async function sha256(value:string){const bytes=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value));return Array.from(new Uint8Array(bytes)).map(byte=>byte.toString(16).padStart(2,"0")).join("")}
export async function identifyTikTok({email,phone,externalId}:{email?:string;phone?:string;externalId?:string}){const normalizedEmail=String(email||"").trim().toLowerCase(),normalizedPhone=String(phone||"").replace(/\D/g,""),normalizedId=String(externalId||"").trim();const identity:Record<string,string>={};if(normalizedEmail)identity.email=await sha256(normalizedEmail);if(normalizedPhone)identity.phone_number=await sha256(normalizedPhone);if(normalizedId)identity.external_id=await sha256(normalizedId);if(!Object.keys(identity).length)return;localStorage.setItem("nadivedas-tiktok-identity",JSON.stringify(identity));window.ttq?.identify?.(identity)}
export function restoreTikTokIdentity(){try{const identity=JSON.parse(localStorage.getItem("nadivedas-tiktok-identity")||"{}") as Record<string,string>;if(Object.keys(identity).length)window.ttq?.identify?.(identity)}catch{}}

export function AnalyticsTracker(){useEffect(()=>{if(location.pathname.startsWith("/pdf-reports/thank-you"))return;const pageViewId=crypto.randomUUID(),started=Date.now(),landingPath=sessionStorage.getItem("nadivedas-landing-path")||`${location.pathname}${location.search}`;sessionStorage.setItem("nadivedas-landing-path",landingPath);let maximumScroll=0,lastReported=0;track("page_view","",location.pathname,{pageViewId,landingPath});if(location.pathname==="/")track("homepage_view","",location.pathname,{pageViewId,landingPath});else if(location.pathname==="/journey")track("journey_view","",location.pathname,{pageViewId,landingPath});
  const onScroll=()=>{const available=Math.max(1,document.documentElement.scrollHeight-innerHeight),depth=Math.min(100,Math.round(scrollY/available*100));maximumScroll=Math.max(maximumScroll,depth);const milestone=[25,50,75,90,100].find(value=>maximumScroll>=value&&lastReported<value);if(milestone){lastReported=milestone;track("scroll_depth","",location.pathname,{pageViewId,scrollDepth:milestone,landingPath})}};
  const click=(event:MouseEvent)=>{const link=(event.target as Element)?.closest?.("a,button");if(link?.getAttribute("href")?.startsWith("/journey")||link?.textContent?.toLowerCase().includes("leaf finding"))track("leaf_finding_cta_click","",location.pathname,{pageViewId,scrollDepth:maximumScroll,landingPath})};
  const finish=(reason:string)=>track("page_exit","",location.pathname,{pageViewId,scrollDepth:maximumScroll,engagedSeconds:Math.min(7200,Math.round((Date.now()-started)/1000)),exitReason:reason,landingPath});
  addEventListener("scroll",onScroll,{passive:true});document.addEventListener("click",click);const hidden=()=>{if(document.visibilityState==="hidden")finish("hidden")};document.addEventListener("visibilitychange",hidden);return()=>{removeEventListener("scroll",onScroll);document.removeEventListener("click",click);document.removeEventListener("visibilitychange",hidden);finish("navigation")}},[]);return null}
