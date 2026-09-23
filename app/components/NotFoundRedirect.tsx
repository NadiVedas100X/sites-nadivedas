"use client";

import {useEffect,useState} from "react";

export function NotFoundRedirect(){
  const [seconds,setSeconds]=useState(3);

  useEffect(()=>{
    const redirect=window.setTimeout(()=>window.location.replace("/"),3000);
    const countdown=window.setInterval(()=>setSeconds(value=>Math.max(0,value-1)),1000);
    return ()=>{window.clearTimeout(redirect);window.clearInterval(countdown)};
  },[]);

  return <p className="not-found-countdown" aria-live="polite">
    Returning you to the NadiVedas homepage in <strong>{seconds}</strong> {seconds===1?"second":"seconds"}…
  </p>;
}
