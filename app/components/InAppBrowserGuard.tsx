"use client";

import {useEffect,useMemo,useState} from "react";

function currentUrl(){
  const url=new URL(window.location.href);
  url.searchParams.delete("_iab_fallback");
  return url.toString();
}

function androidIntent(value:string){
  const url=new URL(value);
  const fallback=new URL(value);
  fallback.searchParams.set("_iab_fallback","1");
  return `intent://${url.host}${url.pathname}${url.search}#Intent;scheme=https;package=com.android.chrome;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;S.browser_fallback_url=${encodeURIComponent(fallback.toString())};end`;
}

export function InAppBrowserGuard(){
  const [visible,setVisible]=useState(false);
  const [android,setAndroid]=useState(false);
  const [app,setApp]=useState("social media");
  const [copied,setCopied]=useState(false);
  const [pageUrl,setPageUrl]=useState("");

  useEffect(()=>{
    const ua=navigator.userAgent||"";
    const ref=document.referrer||"";
    const instagram=/Instagram|Threads/i.test(ua)||/l\.instagram\.com/i.test(ref);
    const facebook=/FBAN|FBAV|FB_IAB|FBIOS|FB4A|Messenger/i.test(ua)||/l\.facebook\.com|lm\.facebook\.com/i.test(ref);
    const androidWebView=/Android/i.test(ua)&&(/;\s*wv\)/i.test(ua)||/Version\/\d+(?:\.\d+)?\s+Chrome\/.*Mobile\s+Safari/i.test(ua));
    if(!instagram&&!facebook&&!androidWebView)return;
    const isAndroid=/Android/i.test(ua);
    const timer=window.setTimeout(()=>{
      setAndroid(isAndroid);
      setApp(instagram?"Instagram":facebook?"Facebook":"this app");
      setPageUrl(currentUrl());
      setVisible(true);
    },0);
    return()=>window.clearTimeout(timer);
  },[]);

  const externalHref=useMemo(()=>{
    if(!pageUrl)return "#";
    return android?androidIntent(pageUrl):pageUrl.replace(/^https:\/\//i,"googlechromes://");
  },[android,pageUrl]);

  async function copy(){
    try{await navigator.clipboard.writeText(pageUrl);setCopied(true);}
    catch{window.prompt("Copy this link and paste it into Chrome or Safari:",pageUrl);}
  }

  async function share(){
    try{await navigator.share({title:document.title,url:pageUrl});}catch{/* share sheet closed */}
  }

  if(!visible)return null;
  return <div className="iab-guard" role="dialog" aria-modal="true" aria-labelledby="iab-guard-title">
    <section className="iab-guard-card">
      <div className="iab-guard-icon" aria-hidden="true">↗</div>
      <p className="iab-guard-kicker">Secure payment browser required</p>
      <h1 id="iab-guard-title">Open NadiVedas in Chrome</h1>
      <p className="iab-guard-copy">{app}’s browser can interrupt OTPs and payments. For a safe payment, continue with this same page in Chrome.</p>
      <a className="iab-guard-primary" href={externalHref}>Open securely in Chrome</a>
      {typeof navigator!=="undefined"&&typeof navigator.share==="function"?<button type="button" onClick={share}>Share to another browser</button>:null}
      <button type="button" onClick={copy}>{copied?"Link copied ✓":"Copy page link"}</button>
      <div className="iab-guard-steps">
        <strong>If the button does not switch apps:</strong>
        <span>1. Tap <b>⋮</b> at the top-right of {app}</span>
        <span>2. Tap <b>Open in external browser</b></span>
        <span>3. Continue the booking in Chrome</span>
      </div>
      <p className="iab-guard-foot">Your current page, referral and booking details are preserved.</p>
    </section>
  </div>;
}
