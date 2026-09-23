"use client";
import {useState} from "react";

export function LineageVideo({videoId,title,image}:{videoId?:string;title:string;image:string}){
  const [playing,setPlaying]=useState(false);
  if(!videoId)return <div className="lp-video lp-video-static"><img src={image} alt={`${title} sacred lineage artwork`} loading="lazy"/><div><span>Visual introduction</span><b>{title}</b><small>A dedicated NadiVedas video for this lineage will be added when available.</small></div></div>;
  return <div className="lp-video">{playing?<iframe src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`} title={title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen/>:<button onClick={()=>setPlaying(true)} aria-label={`Play ${title}`}><img src={image} alt="" loading="lazy"/><i/><span>▶</span><strong>{title}</strong><small>Play the NadiVedas explanation</small></button>}</div>;
}
