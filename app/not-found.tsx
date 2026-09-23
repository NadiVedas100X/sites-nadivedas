import type {Metadata} from "next";
import Image from "next/image";
import Link from "next/link";
import {NotFoundRedirect} from "./components/NotFoundRedirect";

export const metadata:Metadata={
  title:"Page Not Found — Returning to NadiVedas",
  description:"This page could not be found. You will be returned to the NadiVedas homepage.",
  robots:{index:false,follow:true}
};

export default function NotFound(){
  return <main className="not-found-page">
    <Image className="not-found-bg" src="/images/temple-hero.webp" alt="A sacred South Indian temple setting" fill priority sizes="100vw"/>
    <div className="not-found-overlay"/>
    <section className="not-found-card">
      <Link href="/" aria-label="Return to the NadiVedas homepage">
        <Image src="/images/nadivedas-logo-full.png" alt="NadiVedas" width={230} height={83} unoptimized priority/>
      </Link>
      <span className="not-found-code">404 · The leaf is elsewhere</span>
      <h1>This path could not be found.</h1>
      <p>The page may have moved or the address may have been entered incorrectly. Your NadiVedas journey is still waiting.</p>
      <NotFoundRedirect/>
      <Link className="not-found-home" href="/">Return to NadiVedas now <span aria-hidden="true">→</span></Link>
    </section>
  </main>;
}
