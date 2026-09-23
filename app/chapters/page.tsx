import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";
import { chapters, nadiPrices } from "../lib/nadis";

export const metadata: Metadata = {
  title: "Nadi Astrology Chapters and Lineage Specialities",
  description: "Explore the 13 Nadi Kandams and compare how Shiva Vakya, Brahma, Dhanvantari, Bhogar, Kakabhushundi and other Nadi traditions emphasize different life areas.",
  alternates: { canonical: "/chapters" },
};

const slug: Record<string, string> = {
  shiva: "shiva-vakya-nadi", brahma: "brahma-nadi", nandi: "nandi-nadi", kaka: "kaka-bhushundi-nadi", vasishta: "vasishtha-nadi", thirumoolar: "thirumoolar-nadi", bhogar: "bhogar-nadi", dhanvantari: "dhanvantari-nadi", shukra: "shukra-nadi", bhrigu: "bhrigu-nadi", atri: "atri-nadi", agastya: "agastya-nadi",
};

const emphasis: Record<string, { chapters: string[]; summary: string; rank?: string }> = {
  shiva: { rank: "Premier complete-life choice", chapters: ["General Life", "Marriage & Partnership", "Career & Authority", "Remedies & Karma"], summary: "Integrates relationships, career, prosperity, family karma and spiritual direction into one broad life narrative." },
  brahma: { rank: "Deepest destiny perspective", chapters: ["General Life", "Fortune & Dharma", "Liberation", "Past-Life Karma"], summary: "Emphasizes life purpose, karmic design, spiritual direction and the deeper architecture connecting major events." },
  nandi: { rank: "Rare worldly-direction choice", chapters: ["Wealth & Family", "Career & Authority", "Gains & Aspirations", "Fortune & Dharma"], summary: "Places greater weight on enterprise, finance, leadership, responsibility and prosperity guided by spiritual values." },
  kaka: { chapters: ["Career & Authority", "Gains & Aspirations", "Fortune & Timing", "Major Decisions"], summary: "Kakabhushundi Nadi is approached for strategic clarity, career or business timing and the longer consequences of important choices." },
  vasishta: { chapters: ["Wealth & Family", "Marriage & Partnership", "Fortune & Dharma", "Career & Duty"], summary: "Balances household responsibilities, relationships, dharma and practical direction for everyday life." },
  thirumoolar: { chapters: ["Health & Obstacles", "Liberation", "Remedies & Karma", "Spiritual Discipline"], summary: "Emphasizes yogic discipline, wellbeing, inner transformation, spiritual practice and higher purpose." },
  bhogar: { chapters: ["Health & Obstacles", "Longevity", "Remedies & Karma", "Spiritual Protection"], summary: "Bhogar Nadi focuses more strongly on health, healing karma, Siddha-oriented remedies, protection and transformative periods." },
  dhanvantari: { chapters: ["Health & Obstacles", "Longevity", "Remedies & Karma", "Wellness"], summary: "Dhanvantari Nadi gives its strongest attention to health patterns, wellbeing, restorative guidance and healing remedies. It never replaces qualified medical care." },
  shukra: { chapters: ["Marriage & Partnership", "Wealth & Family", "Property & Comforts", "Gains & Aspirations"], summary: "Emphasizes love, marriage, partnership, property, income, comforts and the relationship between values and prosperity." },
  bhrigu: { chapters: ["Career & Authority", "Marriage & Partnership", "Wealth & Family", "Life Timing"], summary: "Known for detailed milestone-oriented themes across career, finance, relationships and major life transitions." },
  atri: { chapters: ["Wealth & Family", "Health & Obstacles", "Remedies & Karma", "Ancestral Blessings"], summary: "Places greater emphasis on family karma, household wellbeing, ancestral patterns, blessings and spiritual protection." },
  agastya: { chapters: ["General Life", "Wealth & Family", "Marriage & Partnership", "Career & Authority"], summary: "Offers a foundational overview across practical life areas. It is presented as an accessible introduction rather than the deepest reading tier." },
};

export default function Page() {
  const ordered = ["shiva", "brahma", "nandi", "kaka", "dhanvantari", "bhogar", "shukra", "bhrigu", "vasishta", "thirumoolar", "atri", "agastya"].map(id => nadiPrices.find(n => n.id === id)!);
  return <main className="new-site chapter-guide">
    <SiteHeader />
    <header className="page-hero chapter-hero"><span className="kicker">13 Kandams · 12 lineage perspectives</span><h1>The same life areas—read with different depth and emphasis.</h1><p>The index leaf identifies the seeker first. The separate continuation bundle then carries the future-prediction reading. Its available Kandams may cover many areas of life, but each Nadi tradition brings a stronger voice to particular themes.</p></header>

    <section className="page-body chapter-overview">
      <span className="kicker dark">The chapter map</span><h2>Thirteen areas a continuation reading may explore.</h2><p>These chapter names are a practical guide, not a promise that every library, lineage or reading format presents identical content. The actual continuation bundle, available depth and chosen scope determine what Guruji can read.</p>
      <div className="chapter-list">{chapters.map((chapter, index) => <article key={chapter}><b>{String(index + 1).padStart(2, "0")}</b><div><h3>{chapter}</h3><p>{index === 0 ? "The broad life overview that follows a verified index leaf." : index === 5 ? "Health patterns, obstacles and wellbeing themes within the traditional reading." : index === 12 ? "Past-life karma, traditional remedies and the path of resolution." : `Future-prediction themes traditionally associated with ${chapter.toLowerCase()}.`}</p></div></article>)}</div>
    </section>

    <section className="lineage-emphasis"><header><span className="kicker">Lineage specialities</span><h2>Which Nadi gives more attention to which chapters?</h2><p>No lineage is limited to only these subjects. The cards show relative emphasis—the themes for which each tradition is most often positioned at NadiVedas.</p></header><div className="lineage-emphasis-grid">{ordered.map(nadi => { const item = emphasis[nadi.id]; return <article className={item.rank ? "priority" : ""} key={nadi.id}><figure><Image src={nadi.image} alt={`${nadi.name} traditional lineage illustration`} fill unoptimized sizes="(max-width: 900px) 100vw, 33vw" /><i /></figure><section>{item.rank && <small>{item.rank}</small>}<h3>{nadi.name}</h3><p>{item.summary}</p><div>{item.chapters.map(chapter => <span key={chapter}>{chapter}</span>)}</div><Link href={`/products/${slug[nadi.id]}`}>Explore {nadi.name} →</Link></section></article>})}</div></section>

    <section className="chapter-compare"><div><span className="kicker dark">Two clear examples</span><h2>Health can appear anywhere—but some lineages go deeper.</h2><p>A general continuation reading may mention health in the Health &amp; Obstacles Kandam. Dhanvantari Nadi gives health, wellness and restorative guidance a much stronger central emphasis. Bhogar Nadi also focuses on health, while bringing more attention to Siddha-oriented healing karma, remedies, protection and transformation.</p><p>Similarly, Kakabhushundi places more weight on career, enterprise, timing and major decisions; Shiva Vakya connects several life areas into a complete-life view; and Brahma Nadi emphasizes deep destiny, purpose and karmic design.</p></div><aside><b>Important boundary</b><p>Health-related Nadi guidance is spiritual and reflective. It does not diagnose, treat or replace a qualified medical professional.</p></aside></section>

    <section className="public-pricing-note nadi-price"><b>First the index leaf; then the right depth.</b><p>₹999 covers finding and verifying the index leaf on Google Meet. The separate continuation-bundle reading starts from ₹11,800. Its lineage, chapter emphasis, individual or family scope and depth are explained before you decide whether to continue.</p></section>
    <section className="nadi-explainer-cta"><span className="kicker">Let the question guide the lineage</span><h2>Choose depth after the index leaf is verified.</h2><p>Shiva Vakya and Brahma offer expansive complete-life perspectives; focused traditions bring greater attention to specific themes.</p><Link href="/journey" className="lux-btn">Begin index-leaf finding · ₹999 <span>→</span></Link></section>
    <SiteFooter />
  </main>;
}
