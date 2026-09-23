import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "../components/SiteChrome";
import { nadiPrices } from "../lib/nadis";

export const metadata: Metadata = {
  title: "The 12 Nadi Traditions | NadiVedas",
  description:
    "Explore Shiva Vakya, Nandi, Kakabhushundi, Vashishta, Bhogar, Agastya, Brahma and other sacred Nadi lineages before beginning your palm-leaf search.",
  alternates: { canonical: "/nadis" },
};

const character: Record<string, { voice: string; best: string }> = {
  shiva: {
    voice: "Expansive · Direct · Complete",
    best: "Life direction, relationships and major turning points",
  },
  nandi: {
    voice: "Rare · Protective · Karmic",
    best: "Business, finance and spiritual growth",
  },
  kaka: {
    voice: "Strategic · Precise · Timely",
    best: "Career, enterprise and decisive life timing",
  },
  vasishta: {
    voice: "Wise · Balanced · Dharmic",
    best: "Family, duty and practical direction",
  },
  thirumoolar: {
    voice: "Yogic · Healing · Inward",
    best: "Spiritual discipline, health and higher purpose",
  },
  bhogar: {
    voice: "Alchemical · Healing · Protective",
    best: "Wellbeing, remedies and healing karma",
  },
  dhanvantari: {
    voice: "Restorative · Focused · Caring",
    best: "Health patterns, wellness and protection",
  },
  shukra: {
    voice: "Abundant · Relational · Refined",
    best: "Love, marriage, property and prosperity",
  },
  bhrigu: {
    voice: "Predictive · Detailed · Far-seeing",
    best: "Destiny timing, finances and relationships",
  },
  atri: {
    voice: "Blessed · Ancestral · Protective",
    best: "Family karma, blessings and spiritual safety",
  },
  agastya: {
    voice: "Foundational · Clear · Practical",
    best: "A complete introduction to your life path",
  },
  brahma: {
    voice: "Rare · Profound · All-encompassing",
    best: "Deep destiny, purpose and karmic design",
  },
};

export default function Page() {
  return (
    <main className="new-site nadi-traditions-page">
      <SiteHeader />
      <header className="nadi-editorial-hero">
        <div>
          <span className="kicker">The 12 sacred lineages</span>
          <h1>
            Not twelve products.
            <br />
            <em>Twelve voices of wisdom.</em>
          </h1>
          <p>
            Each Nadi tradition carries a distinct temperament and emphasis. You
            do not need to choose blindly—our guided discovery helps reveal the
            lineage that best reflects what you are seeking.
          </p>
          <div className="nadi-hero-actions">
            <Link href="/journey" className="lux-btn">
              Begin guided discovery <span>→</span>
            </Link>
            <small>₹999 index-leaf finding · Refunded if no index leaf is found</small>
          </div>
        </div>
        <div className="nadi-hero-orbit">
          <span>12</span>
          <b>
            SACRED
            <br />
            LINEAGES
          </b>
          <small>
            ONE LEAF
            <br />
            MEANT FOR YOU
          </small>
        </div>
      </header>

      <section className="nadi-guidance-strip">
        <span>01</span>
        <p>
          <b>First, tell us what you seek.</b> Three thoughtful questions help
          us recommend a lineage.
        </p>
        <i />
        <span>02</span>
        <p>
          <b>Then, search for your index leaf for ₹999.</b> Guruji classifies
          your thumbprint, searches candidate bundles and verifies the index
          leaf live on Google Meet. Refunded if no matching index leaf is found.
        </p>
        <i />
        <span>03</span>
        <p>
          <b>Continue only if you choose.</b> The separate continuation-bundle
          reading contains the future-prediction material and starts from ₹11,800
          after a successful index-leaf match.
        </p>
      </section>

      <section className="nadi-library">
        <div className="nadi-library-heading">
          <div>
            <span className="kicker dark">Explore the library</span>
            <h2>
              Meet each tradition
              <br />
              through its character.
            </h2>
          </div>
          <p>
            These descriptions help you understand the lineage—not make a
            pressured purchase. Your full reading remains optional even after
            your leaf is found.
          </p>
        </div>
        <div className="tradition-catalog">
          {nadiPrices.map((n, index) => {
            const c = character[n.id];
            return (
              <article id={n.id} className="tradition-card" key={n.id}>
                <div className="tradition-image">
                  <Image
                    src={n.image}
                    alt={`${n.name} — ${n.sage}`}
                    fill
                    unoptimized
                    sizes="(max-width: 900px) 100vw, 26vw"
                  />
                  <div />
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{n.tag}</b>
                </div>
                <section>
                  <small>{n.sage}</small>
                  <h3>{n.name}</h3>
                  <p>{n.focus}</p>
                  <div className="tradition-signals">
                    <span>
                      <small>Character</small>
                      <strong>{c.voice}</strong>
                    </span>
                    <span>
                      <small>Especially suited to</small>
                      <strong>{c.best}</strong>
                    </span>
                  </div>
                  <div className="tradition-booking">
                    <small>Leaf finding</small>
                    <strong>₹999</strong>
                    <em>Refunded if no leaf is found</em>
                  </div>
                  <a href={n.id === "brahma" ? "/brahma-nadi" : `/${n.id === "kaka" ? "kakabhushundi" : n.id}-nadi`}>
                    Explore the {n.name} lineage <span>→</span>
                  </a>
                </section>
              </article>
            );
          })}
        </div>
      </section>

      <section className="nadi-pricing-promise">
        <span>✦</span>
        <div>
          <small>Transparent at the right moment</small>
          <h2>No continuation-bundle payment before the index leaf is verified.</h2>
          <p>
            ₹999 covers Guruji's search for and Google Meet verification of the
            index leaf. Like the first page of a book, it identifies the seeker.
            The separate continuation bundle contains the future-prediction
            reading, starts from ₹11,800 and remains your choice after a match.
          </p>
        </div>
        <Link href="/journey" className="gold-outline">
          Start the guided journey →
        </Link>
      </section>
      <SiteFooter />
    </main>
  );
}
