"use client";
import {useState} from "react";

export function BrahmaVideo(){
  const [playing,setPlaying]=useState(false);
  return <div className="brahma-video-frame">
    {playing?<iframe src="https://www.youtube-nocookie.com/embed/rY7IoGOQKFI?autoplay=1&rel=0&modestbranding=1" title="Brahma Nadi explained by NadiVedas" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen/>:<button className="brahma-video-cover" onClick={()=>setPlaying(true)} aria-label="Play the Brahma Nadi introduction">
      <img src="/images/brahma-vishwamitra-lineage.webp" alt="Brahma Nadi lineage with Brahmarshi Vishwamitra"/>
      <span className="brahma-play"><i>▶</i></span>
      <span className="brahma-video-caption"><b>Brahma Nadi</b><small>Watch the lineage, rarity and leaf-search process · 7 min</small></span>
    </button>}
  </div>
}
