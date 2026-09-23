"use client";

import Image from "next/image";
import { useState } from "react";

export function VideoFacade() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="nadi-video-frame">
      {playing ? (
        <iframe
          src="https://www.youtube-nocookie.com/embed/yAIT8kJCE2Q?autoplay=1&rel=0"
          title="How to find your Nadi leaf: the complete step-by-step process"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)} aria-label="Play the nine-minute guide to Nadi astrology and leaf finding">
          <Image src="/images/blog-nadi-astrology-complete-guide.webp" alt="Editorial illustration of a reader examining palm-leaf manuscripts before the video guide" fill unoptimized sizes="(max-width: 900px) 100vw, 1100px" />
          <span className="video-shade" />
          <span className="video-play">▶</span>
          <span className="video-label"><b>Watch the complete explanation</b><small>What Nadi astrology is and how leaf finding works · About 9 minutes</small></span>
        </button>
      )}
    </div>
  );
}
