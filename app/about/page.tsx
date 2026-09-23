import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";
import { VideoFacade } from "./VideoFacade";

export const metadata: Metadata = {
  title: "What Is Nadi Astrology & How Does It Work?",
  description: "Understand Nadi astrology, palm-leaf manuscripts, thumb-impression classification, bundle searching and live yes-or-no leaf verification in one visual guide.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "What Is Nadi Astrology and How Does It Work?",
    description: "A visual guide from the traditional sage lineages to thumbprint classification, manuscript search and live leaf matching.",
    url: "https://www.nadivedas.com/about",
    images: [{ url: "/images/blog-nadi-astrology-complete-guide.webp", width: 1800, height: 965, alt: "Editorial illustration for a guide to Nadi astrology and palm-leaf finding" }],
  },
};

const steps = [
  ["01", "Begin leaf finding for ₹999", "Register and pay the ₹999 leaf-finding fee. This covers the search for your index leaf and is refunded if no matching index leaf is found."],
  ["02", "Upload a clear thumb impression", "Many Tamil Nadi libraries traditionally request the right thumb for men and the left for women. Library customs can vary."],
  ["03", "Guruji classifies the ridge pattern", "Guruji uses the library’s traditional classification system to narrow the archive to likely manuscript groups. This is a catalogue key—not a prediction."],
  ["04", "Guruji searches candidate bundles", "The physical library is searched for candidate bundles associated with the thumbprint category. More than one bundle may need to be examined."],
  ["05", "Find and verify the index leaf live", "During a private Google Meet video call, Guruji reads identifying statements from candidate leaves. You answer yes or no until an index leaf is verified—or the search ends without a match."],
  ["06", "Choose the continuation bundle", "Think of the index leaf as the first or index page of a book: it establishes that the record corresponds to you. The separate continuation bundle contains the future-prediction reading. It starts from ₹11,800 and is purchased only if you choose to continue."],
] as const;

const faq = [
  ["Is Nadi astrology the same as birth-chart astrology?", "No. A conventional chart reading is calculated from birth data. A Nadi search traditionally begins by using a thumb impression to narrow a physical manuscript collection, followed by live candidate-leaf verification."],
  ["Does the thumbprint itself contain a prediction?", "No. It functions like a traditional catalogue key for the archive. It narrows the search but does not prove that a particular leaf belongs to you."],
  ["Is a matching leaf guaranteed?", "No. A transparent search allows for a genuine non-match. At NadiVedas, the ₹999 leaf-finding fee is refunded when no matching leaf is found."],
  ["Are the sage accounts scientifically proven?", "No. Nadi lineages attribute the records to sages and sacred dialogues as a matter of tradition and faith. Predictive claims are not established scientific facts."],
] as const;

export default function Page() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebPage", name: "What Is Nadi Astrology and How Does It Work?", url: "https://www.nadivedas.com/about", description: "A visual introduction to the Nadi palm-leaf tradition and leaf-finding process." },
      { "@type": "VideoObject", name: "How to Find Your Nadi Leaf: The Complete Step-by-Step Process", description: "A video explanation of Nadi astrology and the palm-leaf search process.", thumbnailUrl: "https://www.nadivedas.com/images/blog-nadi-astrology-complete-guide.webp", embedUrl: "https://www.youtube-nocookie.com/embed/yAIT8kJCE2Q", contentUrl: "https://www.youtube.com/watch?v=yAIT8kJCE2Q" },
      { "@type": "FAQPage", mainEntity: faq.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) },
    ],
  };

  return <main className="new-site nadi-explainer">
    <SiteHeader />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <header className="nadi-explainer-hero">
      <div><span className="kicker">The complete visual guide</span><h1>What is Nadi Astrology—and how does it work?</h1><p>Nadi astrology is a South Indian divination and manuscript tradition in which readers search palm-leaf collections for a record believed to correspond to a particular seeker. A thumb impression narrows the archive; a live yes-or-no conversation tests the candidate leaf.</p><nav><a href="#meaning">Understand the tradition</a><a href="#how-it-works">See the process</a><a href="#video">Watch the guide</a></nav></div>
      <figure><Image src="/images/blog-tamil-palm-manuscript-real.webp" alt="A real Tamil palm-leaf manuscript with long inscribed leaves" fill priority unoptimized sizes="(max-width: 900px) 100vw, 46vw" /><figcaption>Real Tamil palm-leaf manuscript by Ms Sarah Welch, via Wikimedia Commons, CC BY-SA 4.0 · Historical context, not presented as an individual Nadi record</figcaption></figure>
    </header>

    <section id="meaning" className="nadi-meaning">
      <div><span className="kicker dark">The direct answer</span><h2>A manuscript search, not an instant horoscope.</h2><p>Traditional accounts say that sages recorded guidance for people who would arrive at the right time to seek it. Modern Nadi practice centres on preserved or recopied palm-leaf manuscripts held by reading families and libraries, particularly in Tamil Nadu.</p><p>The sacred origin stories belong to faith and lineage. What a visitor can directly observe is the working process: an archive, a classification method, candidate leaves, a reader or translator, and a live matching conversation. Nadi astrology’s predictive claims are spiritual beliefs, not scientifically established facts.</p><div className="nadi-meaning-links"><Link href="/products/shiva-vakya-nadi">Explore Shiva Vakya Nadi →</Link><Link href="/products/brahma-nadi">Explore Brahma Nadi →</Link><Link href="/blogs/what-is-nadi-astrology-complete-guide">Read the detailed guide →</Link></div></div>
      <figure><Image src="/images/shiva.webp" alt="Editorial illustration representing the Shiva Vakya Nadi sacred dialogue" width={1024} height={1024} unoptimized /><figcaption><b>The sacred dialogue.</b> An editorial illustration representing Shiva Vakya Nadi, traditionally framed as a dialogue of Lord Shiva and Parvati and presented by NadiVedas as a premier complete-life lineage.</figcaption></figure>
    </section>

    <section className="nadi-three-keys">
      <article><Image src="/images/brahma-nadi.webp" alt="Editorial illustration representing Brahma Nadi and its complete-life perspective" fill unoptimized sizes="(max-width: 900px) 100vw, 33vw" /><div><span>01 · Origin</span><h3>Premier sacred lineages</h3><p>Shiva Vakya and Brahma Nadi are presented as expansive choices for seekers who want a connected view of life direction, relationships, prosperity, family patterns and spiritual purpose.</p></div></article>
      <article><Image src="/images/blog-nadi-thumb-impression-real.webp" alt="Real scanned fingerprint showing a whorl ridge pattern" fill unoptimized sizes="(max-width: 900px) 100vw, 33vw" /><div><span>02 · Catalogue</span><h3>The thumb impression</h3><p>A ridge-pattern category guides the search towards likely bundles. It is a sorting input, not proof of identity or a scientific prediction.</p></div></article>
      <article><Image src="/images/blog-tamil-palm-manuscript-real.webp" alt="Real South Indian palm-leaf manuscript used to illustrate the physical medium" fill unoptimized sizes="(max-width: 900px) 100vw, 33vw" /><div><span>03 · Test</span><h3>The live verification</h3><p>Candidate statements are checked one by one. Several meaningful identifiers should converge before a leaf is treated as a match.</p></div></article>
    </section>

    <section id="how-it-works" className="nadi-process">
      <header><span className="kicker">How leaf finding works</span><h2>First find the index leaf. Then choose the continuation.</h2><p>The online meeting changes the location of the seeker—not the physical nature of the archive or the need for careful verification.</p></header>
      <div>{steps.map(([number, title, body]) => <article key={number}><b>{number}</b><h3>{title}</h3><p>{body}</p></article>)}</div>
      <aside className="index-leaf-analogy"><b>Like the first page of a book</b><p>The index leaf is the identification page used in the live match. Once it is verified, Guruji can explain the related continuation bundle—the separate manuscript sequence used for the future-prediction reading. ₹999 pays for finding and verifying the index leaf; continuation-bundle readings start from ₹11,800.</p></aside>
    </section>

    <section className="nadi-verification">
      <figure><Image src="/images/blog-nadi-thumb-impression-real.webp" alt="Public-domain fingerprint scan illustrating visible ridge detail" width={1600} height={1498} unoptimized /><figcaption>Public-domain NIST whorl fingerprint via Wikimedia Commons. It illustrates ridge detail, not a Nadi classification chart.</figcaption></figure>
      <div><span className="kicker dark">The credibility checkpoint</span><h2>Matching should test the leaf—not feed it your story.</h2><p>A careful session reads a statement from the candidate and asks for a simple confirmation. “Is your father’s name Ravi?” tests a written claim. “Tell me your father’s name” supplies the answer and weakens the test.</p><ul><li>Give minimal personal detail before matching.</li><li>Answer the statement asked with yes, no or not applicable.</li><li>Notice both accurate statements and misses.</li><li>Allow the process to end without a match.</li><li>Choose any later reading without pressure.</li></ul></div>
    </section>

    <section id="video" className="nadi-video-section"><header><span className="kicker dark">Watch the explanation</span><h2>Nadi astrology and leaf finding—in one nine-minute guide.</h2><p>The video loads only when you press play, helping the page remain fast and avoiding an unnecessary YouTube connection during the initial visit.</p></header><VideoFacade /><p className="video-source">Video: <a href="https://www.youtube.com/watch?v=yAIT8kJCE2Q" target="_blank" rel="noreferrer">How to Find Your Nadi Leaf: The Complete Step-by-Step Process</a> on YouTube.</p></section>

    <section className="nadi-faq"><header><span className="kicker dark">Clear questions</span><h2>What to understand before beginning.</h2></header><div>{faq.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div></section>

    <section className="public-pricing-note nadi-price"><b>₹999 covers finding and verifying the index leaf only.</b><p>If your index leaf is found, the separate continuation-bundle reading starts from ₹11,800. Its exact price varies by Nadi lineage, reading depth and individual or family scope, and is shown before you decide whether to continue.</p></section>
    <section className="nadi-explainer-cta"><span className="kicker">One honest first step</span><h2>Search for the leaf before choosing the reading.</h2><p>No match is guaranteed. If no matching leaf is found, the ₹999 search fee is refunded.</p><Link className="lux-btn" href="/journey">Begin leaf finding · ₹999 <span>→</span></Link></section>
    <SiteFooter />
  </main>;
}
