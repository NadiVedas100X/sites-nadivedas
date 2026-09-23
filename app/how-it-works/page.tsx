import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "../components/SiteChrome";

export const metadata: Metadata = {
  title: "How Nadi Leaf Finding Works | Step-by-Step Process",
  description:
    "Follow the NadiVedas leaf-finding process from registration and thumb-impression classification to bundle search, live verification and the optional full reading.",
  alternates: { canonical: "/how-it-works" },
};

const steps = [
  ["01", "Share your details", "Register with your name, contact details, birth year, gender and preferred languages."],
  ["02", "Book leaf finding for ₹999", "The fee begins the physical index-leaf search and is refunded if no matching index leaf is found."],
  ["03", "Select a Nadi lineage", "Use the guided recommendation or explore all twelve traditions before choosing the library Guruji will search."],
  ["04", "Upload your thumb impression", "A clear print is used as a traditional catalogue key to narrow the manuscript archive to likely bundles."],
  ["05", "Guruji searches the bundles", "The library team examines candidate bundles associated with the traditional thumbprint category."],
  ["06", "Verify the index leaf live", "On Google Meet, Guruji reads statements from candidate leaves. You answer yes or no until one leaf aligns—or the search ends without a match."],
  ["07", "Choose whether to continue", "Only after a verified match are the separate continuation-reading options explained. They start from ₹11,800 and remain optional."],
] as const;

export default function Page() {
  return (
    <main className="new-site">
      <SiteHeader />
      <header className="page-hero">
        <span className="kicker">A transparent seven-step journey</span>
        <h1>How Nadi leaf finding works—from thumb impression to live match.</h1>
        <p>
          This page is about the practical process. For the history, meaning and
          beliefs behind the tradition, visit <Link href="/about">What is Nadi?</Link>
        </p>
      </header>

      <section className="page-body">
        <span className="kicker dark">The complete process</span>
        <h2>First identify the index leaf. Then decide about the reading.</h2>
        <p>
          The ₹999 payment covers searching for and verifying the index leaf—the
          identification page of the manuscript sequence. It does not include
          the separate continuation reading.
        </p>
        <div className="chapter-list">
          {steps.map(([number, title, body]) => (
            <article key={number}>
              <b>{number}</b>
              <div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="index-leaf-analogy">
          <b>A real search can end without a match.</b>
          <p>
            No leaf is guaranteed. If no matching index leaf is found, the ₹999
            leaf-finding fee is refunded. If a leaf is verified, you can review
            the lineage and continuation-reading fee before choosing whether to
            proceed.
          </p>
        </div>
        <div className="new-actions">
          <Link href="/journey" className="lux-btn">
            Begin leaf finding · ₹999 <span>→</span>
          </Link>
          <Link href="/nadis" className="gold-outline">
            Explore the 12 Nadis →
          </Link>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
