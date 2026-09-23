"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { publishedTestimonials } from "../data/publishedTestimonials";

const testimonials = [
  ["wd076q9ttg", "Gautam Singhania", "Chairman, Raymond Group"],
  ["jqk7m3rpkr", "Ankita Lokhande", "Indian actress"],
  ["6sljm6w4dw", "Pankaj Munjal", "Chairman & Managing Director, Hero Cycles"],
  ["tdebxbg3ge", "Sagar Charan Das", "Odisha MLA"],
  ["ddbh3ssfpk", "Emmanuel", "Research scientist from Germany"],
  ["qqs5pmgly9", "Anuj & Swati", "Software couple from Bangalore"],
  ["d1pxki1el6", "Prasiddhi", "TEDx speaker, astrologer & tarot reader"],
  ["a00f6kwsh3", "Raghu", "Software lead from the United States"],
  ["q5y1epmg9e", "Yogesh", "MBBS doctor from India"],
] as const;

type PublishedTestimonial={id:string;type:"video"|"image";name:string;role:string;title:string;quote:string;nadi:string;language:string;aspectRatio:string;priority:number;rating:number;imageUrl:string;posterUrl:string;playbackUrl:string};

export function VideoTestimonials({ compact = false, reportOffer = false }: { compact?: boolean; reportOffer?: boolean }) {
  const track = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [published,setPublished]=useState<PublishedTestimonial[]>(publishedTestimonials.filter(item=>item.id!=="a19fa4f7-7d0a-4e0d-95a3-fe1f6fabd547"));
  useEffect(()=>{let controller:AbortController|undefined;let stopped=false;let retry:ReturnType<typeof window.setTimeout>|undefined;let attempt=0;const refresh=()=>{controller?.abort();controller=new AbortController();const timeout=window.setTimeout(()=>controller?.abort(),12000);fetch("/api/testimonials",{signal:controller.signal,cache:"default"}).then(response=>response.ok?response.json():Promise.reject()).then((payload:{items?:PublishedTestimonial[];complete?:boolean})=>{if(stopped)return;const latest=(payload.items||[]).filter(item=>!item.id.startsWith("legacy-review-")&&item.id!=="a19fa4f7-7d0a-4e0d-95a3-fe1f6fabd547");if(payload.complete&&latest.length){setPublished(Array.from(new Map(latest.map(item=>[item.id,item])).values()));return}throw new Error("Incomplete testimonial catalogue")}).catch(()=>{if(!stopped&&attempt<2){const delay=attempt++===0?1500:4500;retry=window.setTimeout(refresh,delay)}}).finally(()=>window.clearTimeout(timeout))};refresh();return()=>{stopped=true;controller?.abort();if(retry)window.clearTimeout(retry)}},[]);
  const move = (direction: number) =>
    track.current?.scrollBy({
      left: direction * Math.max(290, track.current.clientWidth * 0.82),
      behavior: "smooth",
    });
  return (
    <section
      className={`${compact ? "nv-trust nv-trust-compact" : "nv-trust"}${reportOffer ? " nv-trust-report" : ""}`}
      aria-labelledby={compact ? "reviews-video-title" : "home-video-title"}
    >
      <div className="nv-trust-shell">
        <div className="nv-trust-head">
          <div>
            <span className="nv-trust-eyebrow">Real client experiences</span>
            <h2 id={compact ? "reviews-video-title" : "home-video-title"}>
              Thousands of seekers have already <em>trusted NadiVedas.</em>
            </h2>
          </div>
          <p>
            From business leaders and public figures to families across the
            world, hear how seekers experienced the clarity and personal
            guidance of NadiVedas.
          </p>
        </div>
        <div className="nv-trust-controls" aria-hidden={compact}>
          <button
            type="button"
            onClick={() => move(-1)}
            aria-label="Show previous testimonials"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => move(1)}
            aria-label="Show more testimonials"
          >
            →
          </button>
        </div>
        <div
          className="nv-trust-track"
          ref={track}
          aria-label="NadiVedas video testimonials"
          tabIndex={0}
        >
          {testimonials.map(([id, name, role]) => (
            <article className="nv-trust-card" key={id}>
              <div className="nv-trust-video">
                {playing === id ? (
                  <iframe
                    src={`https://fast.wistia.net/embed/iframe/${id}?seo=false&videoFoam=true&autoplay=1`}
                    title={`${name} NadiVedas testimonial`}
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <>
                    <img
                      className="nv-video-thumb"
                      src={`/images/testimonials/${id}.webp`}
                      alt={`${name} video testimonial preview`}
                      loading="lazy"
                      decoding="async"
                    />
                    <button
                      type="button"
                      className="nv-video-poster"
                      onClick={() => setPlaying(id)}
                      aria-label={`Play ${name}'s testimonial`}
                    >
                      <span>▶</span>
                      <small>Play client story</small>
                    </button>
                  </>
                )}
              </div>
              <div className="nv-trust-meta">
                <span aria-label="Five-star experience">★★★★★</span>
                <h3>{name}</h3>
                <p>{role}</p>
              </div>
            </article>
          ))}
          {compact&&<div className="nv-trust-latest"><span>Latest published stories</span><b>{published.length} new {published.length===1?"story":"stories"}</b></div>}
          {published.map((item,index) => (
            <article className="nv-trust-card" key={item.id}>
              <div className="nv-trust-video">
                {item.type==="video"&&playing===item.id&&item.playbackUrl?<iframe src={item.playbackUrl} title={`${item.name} NadiVedas testimonial`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen/>:<>
                  <img className="nv-video-thumb" src={item.imageUrl||item.posterUrl} alt={`${item.name} testimonial`} loading="lazy" decoding="async"/>
                  {item.type==="video"&&<button type="button" className="nv-video-poster" onClick={()=>setPlaying(item.id)} aria-label={`Play ${item.name}'s testimonial`}><span>▶</span><small>Play client story</small></button>}
                </>}
              </div>
              <div className="nv-trust-meta"><span aria-label={`${item.rating||5} star experience`}>{compact&&<small className="nv-story-number">Story {testimonials.length+index+1}</small>}{"★".repeat(Math.floor(item.rating||5))}{(item.rating||5)%1?"½":""}</span><h3>{item.name}</h3><p>{item.role}</p>{item.quote&&<blockquote>“{item.quote}”</blockquote>}</div>
            </article>
          ))}
        </div>
        <div className="nv-trust-footer">
          <p>{compact ? "Choose any story to watch. New published testimonials appear here automatically." : "← Swipe to watch more real NadiVedas experiences →"}</p>
          <Link href={reportOffer ? "/blogs/reviews" : "/journey"}>
            {reportOffer ? "Read the stories behind the reviews" : "Begin your Nadi journey"} <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
