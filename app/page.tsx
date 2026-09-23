import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteFooter, SiteHeader } from "./components/SiteChrome";
import { VideoTestimonials } from "./components/VideoTestimonials";
import { LeafOfferCta } from "./components/LeafOfferCta";
import { nadiPrices } from "./lib/nadis";

export const metadata: Metadata = {
  title: "Authentic Nadi Astrology & Palm Leaf Reading",
  description:
    "Begin an authentic Nadi palm-leaf search with traditional readers. ₹999 leaf finding, fully refunded if your leaf is not found.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <main className="new-site">
      <SiteHeader />
      <section className="new-hero">
        <Image
          src="/images/temple-hero.webp"
          alt="Ancient Tamil temple connected with the Nadi tradition"
          fill
          priority
          unoptimized
          sizes="100vw"
        />
        <div className="new-hero-overlay" />
        <div className="new-hero-copy">
          <span className="kicker">Authentic Nadi astrology · Tamil palm-leaf tradition</span>
          <h1>
            A leaf written long ago
            <br />
            may begin with <em>your name.</em>
          </h1>
          <p>
            Begin with a real library search—not a generated horoscope. Your
            thumb impression narrows the palm-leaf bundles; a candidate leaf is
            accepted only when the details align in a live yes-or-no session.
          </p>
          <div className="new-actions">
            <LeafOfferCta />
            <Link href="/about#how-it-works" className="ghost-btn">
              See exactly how matching works
            </Link>
          </div>
          <div className="hero-decision-note"><b>₹999 today</b><span>Refunded if no matching leaf is found</span><i/><b>₹11,800+</b><span>Full reading only after a match, if you choose it</span></div>
          <div className="hero-proof">
            <div>
              <strong>Physical</strong>
              <span>palm-leaf search</span>
            </div>
            <div>
              <strong>13</strong>
              <span>sacred chapters</span>
            </div>
            <div>
              <strong>100%</strong>
              <span>refund if not found</span>
            </div>
          </div>
        </div>
        <p className="hero-caption">Vaitheeswaran Koil · Tamil Nadu</p>
      </section>

      <section className="shiva-conversion" id="nadis">
        <div className="shiva-visual">
          <Image src="/images/chapters-hero.webp" alt="Editorial artwork representing palm-leaf readers and the sacred Nadi lineages" fill unoptimized sizes="(max-width: 900px) 100vw, 48vw"/>
          <div/>
          <span>12 sacred lineages</span>
          <blockquote>Each Nadi carries a distinct voice, emphasis and traditional path of guidance.</blockquote>
        </div>
        <div className="shiva-copy">
          <span className="kicker dark">Meet the Nadi traditions</span>
          <h2>Different lineages. One careful search for your leaf.</h2>
          <p>Shiva Vakya is our most selected lineage, but it is not the only path. Each tradition brings a different emphasis—from complete-life direction and family questions to career, wellbeing, prosperity and spiritual purpose.</p>
          <div className="shiva-themes"><span>Shiva Vakya</span><span>Nandi</span><span>Kakabhushundi</span><span>Vashishta</span><span>Bhogar</span><span>Brahma</span></div>
          <div className="shiva-clarity"><div><small>EXPLORE</small><b>Understand each lineage</b><p>Compare its traditional voice, focus and the questions it is suited to.</p></div><i>→</i><div><small>THEN BEGIN</small><b>Find the index leaf</b><p>₹999 covers classification, bundle search and live verification.</p></div></div>
          <Link href="/nadis" className="lux-btn">Explore all 12 Nadis <span>→</span></Link>
          <small className="shiva-footnote">You do not need to choose blindly. The guided journey recommends a lineage and still lets you explore every option.</small>
        </div>
      </section>

      <section className="belief-strip">
        <span>A transparent traditional process</span>
        <b>THUMBPRINT CLASSIFICATION</b>
        <i /> <b>PHYSICAL LEAF SEARCH</b>
        <i /> <b>LIVE YES–NO MATCHING</b>
        <i /> <b>NO FORCED MATCH</b>
        <i /> <b>REFUND IF NOT FOUND</b>
      </section>

      <section className="editorial-intro">
        <div>
          <span className="kicker dark">A manuscript, not a calculation</span>
          <h2>
            Somewhere among thousands of leaves, one may begin with{" "}
            <em>your name.</em>
          </h2>
        </div>
        <div>
          <p>
            Nadi Shastra holds that ancient sages recorded the journeys of
            particular souls—family details, life events, karmic patterns and
            the remedies prescribed for them.
          </p>
          <p>
            Your thumb impression narrows the library to a small set of bundles.
            Guruji then tests each candidate leaf in a live session. You answer
            only yes or no. A match is accepted only when one leaf aligns across
            your identity and life.
          </p>
          <Link href="/about">
            Discover the Nadi tradition <span>→</span>
          </Link>
        </div>
      </section>

      <section className="cinema-process">
        <div className="process-image">
          <Image
            src="/images/chapters-hero.webp"
            alt="Palm-leaf manuscript illuminated by warm temple light"
            fill
            unoptimized
            sizes="(max-width: 900px) 100vw, 54vw"
          />
        </div>
        <div className="process-copy">
          <span className="kicker">The leaf-finding ritual</span>
          <h2>
            One search.
            <br />
            No forced matches.
          </h2>
          {[
            [
              "01",
              "Reserve your search",
              "Pay ₹999 to begin the search for your index leaf.",
            ],
            [
              "02",
              "Classify the thumbprint",
              "Upload a clear print. Guruji maps its ridge pattern to the traditional library classification.",
            ],
            [
              "03",
              "Search the bundles",
              "Guruji searches the physical library for candidate bundles linked to that classification.",
            ],
            [
              "04",
              "Verify live",
              "On Google Meet, Guruji tests candidate leaves to verify the index leaf. Its separate continuation bundle contains the future-prediction reading.",
            ],
          ].map(([n, t, d]) => (
            <div className="process-line" key={n}>
              <b>{n}</b>
              <span>
                <strong>{t}</strong>
                <small>{d}</small>
              </span>
            </div>
          ))}
          <Link href="/about#how-it-works" className="gold-outline">
            See the complete eight-step process →
          </Link>
        </div>
      </section>

      <section className="signature-nadis">
        <div className="premium-heading">
          <span className="kicker dark">Nadi traditions</span>
          <h2>
            Begin with the lineage
            <br />
            seekers choose most.
          </h2>
          <p>
            Shiva Vakya is the most selected starting point, while every lineage
            carries a different emphasis. After paying ₹999, the guided journey
            helps you choose. Full readings start from ₹11,800 and are paid only
            after a verified match if you decide to continue.
          </p>
        </div>
        <div className="signature-grid">
          {nadiPrices.slice(0, 4).map((n, i) => (
            <article
              key={n.id}
              className={i === 0 ? "signature-card main" : "signature-card"}
            >
              <Image src={n.image} alt={n.name} fill unoptimized />
              <div />
              <span className="nadi-badge">{n.tag}</span>
              <section>
                <small>{n.sage}</small>
                <h3>{n.name}</h3>
                <p>{n.focus}</p>
                <Link href={`/nadis#${n.id}`}>Understand this lineage →</Link>
              </section>
            </article>
          ))}
        </div>
        <div className="homepage-fee-note">
          <span>✦</span>
          <p>
            <b>₹999 covers finding and verifying the index leaf.</b> Think of it
            as the first or index page of a book. The separate continuation
            bundle contains the future-prediction reading, starts from ₹11,800
            and is paid only after a verified match if you choose to continue.
          </p>
        </div>
        <Link href="/nadis" className="all-link">
          Explore all 12 Nadi traditions <span>→</span>
        </Link>
      </section>

      <section className="high-trust">
        <div>
          <span className="kicker">The promise</span>
          <h2>
            If your leaf is not found,
            <br />
            every rupee comes back.
          </h2>
          <p>
            The ₹999 fee pays for the physical search—not a prediction. When no
            manuscript matches, it is refunded in full. Optional full readings
            start from ₹11,800 and remain a separate decision made only after a
            successful match.
          </p>
          <Link href="/refund-policy">Read the refund promise →</Link>
        </div>
        <div className="refund-orbit">
          <strong>₹999</strong>
          <span>
            FULLY
            <br />
            REFUNDABLE
          </span>
          <small>IF NO LEAF IS FOUND</small>
        </div>
      </section>

      <VideoTestimonials />

      <section className="social-proof">
        <div className="premium-heading">
          <span className="kicker dark">Real seeker experiences</span>
          <h2>
            The moment scepticism
            <br />
            became stillness.
          </h2>
        </div>
        <div className="featured-quotes">
          <blockquote>
            <span>“</span>
            <p>
              Koi mere baare mein likh kar gaya—wahi sabse badi baat hai. The
              session was excellent and amazing.
            </p>
            <footer>
              <b>Ankita Lokhande</b>
              <small>Indian Actress · Mumbai</small>
            </footer>
          </blockquote>
          <blockquote>
            <span>“</span>
            <p>
              Everything about my marriage situation was on that leaf. The
              details were too specific to dismiss.
            </p>
            <footer>
              <b>Sindhu A.</b>
              <small>Verified seeker · Trichy</small>
            </footer>
          </blockquote>
          <blockquote>
            <span>“</span>
            <p>
              Honest and professional even when the leaf was not there. The
              refund came back as promised.
            </p>
            <footer>
              <b>Deepa K.</b>
              <small>Verified seeker · Chennai</small>
            </footer>
          </blockquote>
        </div>
        <Link href="/reviews" className="all-link">
          Watch and read more seeker stories →
        </Link>
      </section>

      <section className="final-lux">
        <Image
          src="/images/chapters-hero.webp"
          alt=""
          fill
          unoptimized
          sizes="100vw"
        />
        <div />
        <section>
          <span className="kicker">Your first step</span>
          <h2>
            Perhaps your leaf
            <br />
            has been waiting.
          </h2>
          <p>
            Start with your name, email and WhatsApp number. No payment is taken
            until the next step.
          </p>
          <Link href="/journey" className="lux-btn">
            Begin my leaf search <span>→</span>
          </Link>
        </section>
      </section>
      <SiteFooter />
    </main>
  );
}
