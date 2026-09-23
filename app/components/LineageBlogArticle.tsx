import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "./SiteChrome";

export type LineageArticle = {
  slug: string; title: string; description: string; category: string; dek: string;
  image: string; imageAlt: string; imageWidth: number; imageHeight: number;
  caption: string; attributionUrl: string; attributionLabel: string; licenseUrl: string; licenseLabel: string;
  date?: string;
  intro: string[]; directAnswer: string; sections: Array<{ title: string; paragraphs: string[]; checklist?: { title: string; lines: string[] } }>;
  faqs: Array<[string, string]>; sources: Array<[string, string]>; related: Array<[string, string]>;
};

export function lineageMetadata(a: LineageArticle): Metadata {
  const url = `https://www.nadivedas.com/blogs/${a.slug}`;
  const date = a.date ?? "2026-08-15";
  const image = { url: a.image, width: a.imageWidth, height: a.imageHeight, alt: a.imageAlt };
  return { title: a.title, description: a.description, alternates: { canonical: url }, openGraph: { type: "article", url, title: a.title, description: a.description, publishedTime: `${date}T00:30:00+05:30`, modifiedTime: `${date}T00:30:00+05:30`, authors: ["NadiVedas Editorial Team"], images: [image] }, twitter: { card: "summary_large_image", title: a.title, description: a.description, images: [a.image] } };
}

export function LineageBlogArticle({ article: a }: { article: LineageArticle }) {
  const url = `https://www.nadivedas.com/blogs/${a.slug}`;
  const date = a.date ?? "2026-08-15";
  const displayDate = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Kolkata" }).format(new Date(`${date}T12:00:00+05:30`));
  const schema = { "@context": "https://schema.org", "@graph": [
    { "@type": "Article", headline: a.title, description: a.description, image: `https://www.nadivedas.com${a.image}`, datePublished: date, dateModified: date, author: { "@type": "Organization", name: "NadiVedas Editorial Team", url: "https://www.nadivedas.com/about" }, publisher: { "@type": "Organization", name: "NadiVedas", logo: { "@type": "ImageObject", url: "https://www.nadivedas.com/images/nadivedas-logo-full.png" } }, mainEntityOfPage: url, about: [a.title.replace(/:.*/, ""), "Nadi astrology", "Palm-leaf reading", "Tamil manuscript tradition"] },
    { "@type": "FAQPage", mainEntity: a.faqs.map(([q, answer]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: answer } })) },
  ] };
  return <main className="new-site long-blog"><SiteHeader />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <header className="long-blog-hero"><Image src={a.image} alt={a.imageAlt} fill priority unoptimized sizes="100vw" /><div /><section><Link href="/blogs">← All blogs</Link><span>{a.category} · 18 min read</span><h1>{a.title}</h1><p>{a.dek}</p><footer><b>NadiVedas Editorial Team</b><time dateTime={date}>Published {displayDate}</time><small>Reviewed for tradition, evidence boundaries and seeker safety</small></footer></section></header>
    <div className="long-blog-shell"><aside><b>In this guide</b><a href="#answer">Direct answer</a>{a.sections.map((s, i) => <a key={s.title} href={`#section-${i + 1}`}>{s.title}</a>)}<a href="#faq">FAQs</a><Link href="/journey">Begin ₹999 leaf finding →</Link></aside>
      <article className="long-blog-copy">
        <p className="blog-dek">{a.intro[0]}</p>{a.intro.slice(1).map(p => <p key={p}>{p}</p>)}
        <div id="answer" className="blog-summary"><b>The direct answer</b><p>{a.directAnswer}</p></div>
        {a.sections.map((s, i) => <section id={`section-${i + 1}`} key={s.title}><span>{String(i + 1).padStart(2, "0")}</span><h2>{s.title}</h2>{s.paragraphs.map(p => <p key={p}>{p}</p>)}{s.checklist && <div className="blog-checklist"><h3>{s.checklist.title}</h3><p>{s.checklist.lines.map((line, j) => <span key={line}>{j ? <br /> : null}✓ {line}</span>)}</p></div>}{i === 1 && <figure className="blog-real-figure"><Image src={a.image} alt={a.imageAlt} width={a.imageWidth} height={a.imageHeight} unoptimized /><figcaption><b>{a.caption}</b> <a href={a.attributionUrl} rel="noreferrer">{a.attributionLabel}</a>, licensed <a href={a.licenseUrl} rel="noreferrer">{a.licenseLabel}</a>. Resized and compressed to WebP; no scene elements added.</figcaption></figure>}</section>)}
        <section id="faq"><span>{String(a.sections.length + 1).padStart(2, "0")}</span><h2>Frequently asked questions</h2>{a.faqs.map(([q, answer]) => <details key={q}><summary>{q}</summary><p>{answer}</p></details>)}</section>
        <section className="blog-sources"><span>Sources and further reading</span><h2>Continue with the documented context</h2><p>The sources below help distinguish sacred attribution, observable practice and current service descriptions. A source describing a tradition does not by itself prove the authorship or predictive accuracy of an individual leaf.</p><ul>{a.sources.map(([label, href]) => <li key={href}><a href={href} rel="noreferrer">{label}</a></li>)}{a.related.map(([label, href]) => <li key={href}><Link href={href}>{label}</Link></li>)}</ul></section>
        <div className="article-next"><h2>Begin your personal leaf-finding journey</h2><p>₹999 covers Guruji’s index-leaf search and live verification. When an index leaf matches, the continuation reading opens the deeper guidance preserved for your life, and the NadiVedas team explains the next step clearly.</p><Link className="lux-btn" href="/journey">Begin leaf finding for ₹999</Link></div>
      </article>
    </div><SiteFooter />
  </main>;
}
