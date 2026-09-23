import {getCmsBlog,cmsMetadata} from '../../lib/blog-cms';
import CmsBlogArticle from '../../components/CmsBlogArticle';
import {notFound} from 'next/navigation';
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SiteHeader, SiteFooter } from "../../components/SiteChrome";
const url =
  "https://www.nadivedas.com/blogs/what-is-nadi-astrology-complete-guide";
const fallbackMetadata: Metadata = {
  title: "What Is Nadi Astrology? Complete Palm-Leaf Reading Guide",
  description:
    "Understand Nadi astrology: its palm-leaf tradition, thumb-impression search, matching process, Kandams, lineages, online readings, costs and questions to ask.",
  alternates: { canonical: url },
  openGraph: {
    type: "article",
    url,
    title: "What Is Nadi Astrology? The Complete Guide to Palm-Leaf Readings",
    description:
      "A detailed, transparent guide to the Nadi astrology tradition and the complete journey from thumb impression to a matched palm leaf.",
    publishedTime: "2026-08-07T00:00:00+05:30",
    authors: ["NadiVedas Editorial Team"],
    images: [
      {
        url: "/images/blog-nadi-astrology-complete-guide.webp",
        width: 1672,
        height: 939,
        alt: "Traditional Nadi reader examining a palm-leaf manuscript",
      },
    ],
  },
};
const faq = [
  [
    "What is Nadi astrology?",
    "Nadi astrology is a South Indian divination and manuscript tradition in which readers search collections of palm-leaf records for a leaf believed to correspond to an individual. The search commonly begins with a thumb impression and continues through a live yes-or-no matching process.",
  ],
  [
    "Which thumb is used for a Nadi reading?",
    "In the convention followed by many Tamil Nadi centres, men provide the right thumb and women provide the left. Practices can differ between libraries, so follow the instructions of the centre conducting the search.",
  ],
  [
    "Do I need my exact birth time?",
    "An exact birth time is generally not required to begin the leaf-finding stage. A matching leaf may itself contain birth-related identifiers, which are tested during the live session.",
  ],
  [
    "Is a Nadi leaf guaranteed to be found?",
    "No responsible centre should guarantee a match. A search may end without a suitable leaf, and an honest no-match is preferable to forcing unrelated statements to fit.",
  ],
  [
    "Can a Nadi reading be conducted online?",
    "The matching conversation and reading can be conducted by video call when the physical manuscript search remains with the reader and the seeker can hear, answer and receive translation clearly.",
  ],
  [
    "What happens after my leaf is matched?",
    "The reader can explain available chapters, the chosen lineage, reading depth, duration and fee. Continuing to a full reading should remain the seeker’s choice.",
  ],
];
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      headline:
        "What Is Nadi Astrology? The Complete Guide to Palm-Leaf Readings",
      description:
        "A detailed guide to Nadi astrology, palm-leaf searching, thumb-impression classification and live leaf matching.",
      image:
        "https://www.nadivedas.com/images/blog-nadi-astrology-complete-guide.webp",
      datePublished: "2026-08-07",
      dateModified: "2026-08-07",
      author: {
        "@type": "Organization",
        name: "NadiVedas Editorial Team",
        url: "https://www.nadivedas.com/about",
      },
      publisher: {
        "@type": "Organization",
        name: "NadiVedas",
        logo: {
          "@type": "ImageObject",
          url: "https://www.nadivedas.com/images/nadivedas-logo-full.png",
        },
      },
      mainEntityOfPage: url,
    },
    {
      "@type": "FAQPage",
      mainEntity: faq.map(([question, answer]) => ({
        "@type": "Question",
        name: question,
        acceptedAnswer: { "@type": "Answer", text: answer },
      })),
    },
  ],
};
function StaticPage() {
  return (
    <main className="new-site long-blog">
      <SiteHeader />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <header className="long-blog-hero">
        <Image
          src="/images/blog-nadi-astrology-complete-guide.webp"
          alt="Traditional Nadi reader examining a palm-leaf manuscript in an ancient South Indian archive"
          fill
          priority
          unoptimized
          sizes="100vw"
        />
        <div />
        <section>
          <Link href="/blogs">← All blogs</Link>
          <span>Pillar guide · 18 min read</span>
          <h1>
            What Is Nadi Astrology? The Complete Guide to Palm-Leaf Readings
          </h1>
          <p>
            From one thumb impression to a room of ancient manuscripts: a clear,
            careful account of what the tradition believes, how a leaf is
            searched and how to approach the experience without surrendering
            your judgement.
          </p>
          <footer>
            <b>NadiVedas Editorial Team</b>
            <time dateTime="2026-08-07">Published 7 August 2026</time>
            <small>Reviewed for process accuracy and seeker clarity</small>
          </footer>
        </section>
      </header>
      <div className="long-blog-shell">
        <aside>
          <b>In this guide</b>
          <a href="#meaning">What Nadi astrology means</a>
          <a href="#origins">Origins and manuscripts</a>
          <a href="#process">How the process works</a>
          <a href="#thumb">Why the thumb matters</a>
          <a href="#matching">The matching conversation</a>
          <a href="#kandams">The 13 Kandams</a>
          <a href="#lineages">Major lineages</a>
          <a href="#online">Online readings</a>
          <a href="#authenticity">Authenticity and questions to clarify</a>
          <a href="#prepare">How to prepare</a>
          <a href="#faq">Frequently asked questions</a>
          <Link href="/journey">Begin ₹999 leaf finding →</Link>
        </aside>
        <article className="long-blog-copy">
          <p className="blog-dek">
            Imagine entering a library where the catalogue does not begin with
            an author, a title or even a date. It begins with the ridges of your
            thumb. A reader studies the impression, disappears among tied
            bundles of narrow brown leaves and returns with a small number of
            possibilities. Then the real test begins: not a performance in which
            you tell your life story, but a process of elimination in which the
            manuscript must appear to tell yours.
          </p>
          <p>
            That image explains why Nadi astrology inspires fascination,
            devotion and scepticism in equal measure. It also explains why a
            useful guide must do more than repeat a dramatic claim. A seeker
            needs to understand the tradition’s own account, the practical
            sequence of a search, the limits of what can be promised and the
            questions that protect an honest experience.
          </p>
          <div className="blog-summary">
            <b>The short answer</b>
            <p>
              Nadi astrology—also called Nadi Jyotisha or Nadi Jothidam—is a
              South Indian palm-leaf manuscript tradition. Practitioners search
              for a record believed to correspond to a seeker, commonly using a
              thumb impression to narrow the archive. Candidate leaves are
              tested in a live yes-or-no matching session. If one leaf
              consistently identifies the seeker, its available chapters may
              then be read. These spiritual claims are matters of tradition and
              belief, not established scientific facts.
            </p>
          </div>

          <section id="meaning">
            <span>01</span>
            <h2>What does “Nadi astrology” actually mean?</h2>
            <p>
              The phrase is used in more than one Indian context. In this guide,
              it refers specifically to the Tamil palm-leaf reading
              tradition—not the yogic energy channels called nadis and not the
              Nadi compatibility category used in some forms of horoscope
              matching. This distinction matters because the same word “Nadi”
              can describe three unrelated ideas.
            </p>
            <p>
              In the palm-leaf tradition, collections of manuscripts are
              associated with sages or sacred lineages. The central belief is
              that particular life records were perceived by enlightened seers
              and preserved for the people who would eventually seek them. The
              manuscript is therefore treated as something to be found and
              verified, rather than a horoscope created for the visitor on the
              day.
            </p>
            <p>
              That difference shapes the entire encounter. A conventional Vedic
              astrology consultation usually calculates and interprets a birth
              chart from date, time and place. A Nadi search commonly starts
              with a thumb impression. Birth-related information may become part
              of the later verification, but it should not need to be supplied
              as a complete biography before the search begins.
            </p>
          </section>

          <section id="origins">
            <span>02</span>
            <h2>From oral tradition to palm-leaf manuscript</h2>
            <p>
              Nadi narratives commonly attribute the knowledge to sages such as
              Agastya, while other traditions describe sacred dialogues—for
              example, words spoken between Lord Shiva and Parvati. These
              attributions belong to religious and lineage history. Surviving
              manuscript collections, meanwhile, exist within the broader South
              and Southeast Asian practice of recording texts on prepared palm
              leaves.
            </p>
            <p>
              A palm-leaf manuscript is not a modern sheet of paper. Leaves were
              prepared, dried, cut into long strips and inscribed, often by
              scratching characters into the surface before applying pigment.
              Holes allowed leaves to be strung and stored between covers.
              Climate, insects and repeated handling made preservation
              difficult, so manuscripts could be recopied by later custodians.
              That reality helps explain why “ancient knowledge” and the
              physical age of any individual surviving leaf are not necessarily
              the same claim.
            </p>
            <figure className="blog-real-figure wide">
              <Image
                src="/images/blog-tamil-palm-manuscript-real.webp"
                alt="A real Tamil palm-leaf manuscript containing Tamil, Telugu and Sanskrit writing"
                width={1400}
                height={502}
                unoptimized
              />
              <figcaption>
                <b>A real South Indian palm-leaf manuscript.</b> Shown to
                explain the physical medium; it is not presented as an
                individual Nadi record. Photograph by Ms Sarah Welch, via{" "}
                <a
                  href="https://commons.wikimedia.org/wiki/File:Palm-leaf_manuscript,_ancient_and_medieval_Tamil_literature_(partly_Sangam_era),_Languages_in_the_manuscript_Tamil_Telugu_Sanskrit,_Scripts_Grantha_Telugu_Tamil,_Hindu_Shaivism_monastery,_UVSL_589.jpg"
                  rel="noreferrer"
                >
                  Wikimedia Commons
                </a>
                , licensed under{" "}
                <a
                  href="https://creativecommons.org/licenses/by-sa/4.0"
                  rel="noreferrer"
                >
                  CC BY-SA 4.0
                </a>
                . Cropped and compressed for the web.
              </figcaption>
            </figure>
            <p>
              Vaitheeswaran Koil in Tamil Nadu is widely associated with Nadi
              reading, although manuscript libraries and reading families are
              not limited to one location. Different custodians preserve
              different collections, methods and lineage stories. There is no
              single universal archive containing every Nadi leaf, and no
              responsible explanation should imply that every person is
              guaranteed to have a discoverable record in a particular library.
            </p>
            <figure className="blog-real-figure portrait">
              <Image
                src="/images/blog-vaitheeswaran-koil-real.webp"
                alt="Real photograph of the Vaitheeswaran Koil temple complex in Tamil Nadu"
                width={1400}
                height={1050}
                unoptimized
              />
              <figcaption>
                <b>Vaitheeswaran Koil, Tamil Nadu.</b> The town is widely
                associated with the Tamil Nadi-reading tradition. Photograph by
                raguleo, via{" "}
                <a
                  href="https://commons.wikimedia.org/wiki/File:VAITHEESWARAN_KOIL_-_panoramio.jpg"
                  rel="noreferrer"
                >
                  Wikimedia Commons
                </a>
                , licensed under{" "}
                <a
                  href="https://creativecommons.org/licenses/by/3.0"
                  rel="noreferrer"
                >
                  CC BY 3.0
                </a>
                . Cropped and compressed for the web.
              </figcaption>
            </figure>
          </section>

          <section id="process">
            <span>03</span>
            <h2>How a Nadi palm-leaf reading works, step by step</h2>
            <h3>1. The seeker books a leaf search</h3>
            <p>
              The first transaction should be for the work of searching, not a
              promise that a prediction has already been found. At NadiVedas,
              leaf finding costs ₹999. If no matching leaf is found, that fee is
              refunded. A full reading is a separate choice made only after a
              match.
            </p>
            <h3>2. A thumb impression is submitted</h3>
            <p>
              Many Tamil Nadi conventions use the right thumb for men and the
              left thumb for women. A clear, complete ridge impression matters
              more than an attractive photograph. The print functions like a
              catalogue key: it directs the reader toward one portion of the
              collection.
            </p>
            <h3>3. Likely bundles are selected</h3>
            <p>
              The reader or library team classifies the print and retrieves
              candidate bundles. Traditional accounts describe numerous primary
              patterns and subtypes. Public explanations often mention 108
              classifications, but terminology and counting can differ between
              centres; it is wiser to understand the principle than to treat one
              number as universal.
            </p>
            <h3>4. Leaves are tested during a live call</h3>
            <p>
              The reader voices statements from a candidate leaf. The seeker
              responds yes or no. A wrong statement eliminates that leaf; a
              correct statement allows the reader to continue. Translation may
              be needed when the manuscript or reader uses Tamil and the seeker
              prefers another language.
            </p>
            <h3>5. One leaf must produce a coherent match</h3>
            <p>
              A credible match does not rest on one broad sentence. Several
              identifiers should converge on the same leaf: aspects of the
              seeker’s name, parents, family structure, marriage status,
              profession or birth markers may be tested. The exact sequence
              varies, but consistency is the point.
            </p>
            <h3>6. The optional full reading is explained</h3>
            <p>
              After matching, the centre can explain the lineage, available
              Kandams, expected duration and price. NadiVedas full readings
              start from ₹11,800 and vary by lineage and depth. A seeker should
              be free to stop after matching, ask questions or schedule the
              reading later.
            </p>
          </section>

          <section id="thumb">
            <span>04</span>
            <h2>Why does the search begin with a thumb impression?</h2>
            <p>
              The simplest helpful analogy is a library catalogue. Your
              fingerprint does not contain a miniature prediction that the
              reader decodes. Instead, its visible ridge pattern is used to
              narrow a very large collection into a smaller family of bundles.
              The manuscript—not the fingerprint—is then expected to supply
              identifying statements.
            </p>
            <p>
              This is also why a thumb impression does not establish that a leaf
              belongs to you. Thousands of people can share a broad
              ridge-pattern category. Classification reduces the search space;
              the matching conversation tests the candidate. Confusing these two
              stages makes the process sound either more scientific or more
              magical than practitioners themselves need to claim.
            </p>
            <p>
              For a useful submission, place the entire thumb pad on clean white
              paper with dark ink, avoid smudging and photograph it in even
              light. Do not crop away the edges of the pattern or use beauty
              filters. A centre that cannot read the ridges should ask for a
              clearer impression rather than pretending certainty.
            </p>
          </section>

          <section id="matching">
            <span>05</span>
            <h2>
              The emotional centre of the experience: the matching conversation
            </h2>
            <p>
              For many seekers, matching is the moment curiosity becomes
              intensely personal. A general statement can be coincidence. A
              sequence that appears to move through family names, relationships
              and life markers feels different. That emotional force is
              precisely why the session needs disciplined boundaries.
            </p>
            <p>
              Answer only the question asked. “Yes,” “no” and “I do not
              understand—please repeat” are usually enough. Avoid correcting the
              reader with the right information after a wrong statement. Do not
              explain your recent problems while leaves are still being
              eliminated. Every extra clue makes it harder for you to judge what
              came from the manuscript and what came from the conversation.
            </p>
            <p>
              A reader should also be comfortable abandoning a candidate. If
              answers become increasingly strained—“almost,” “perhaps,” or “it
              could mean”—pause. Translation and variations in names can require
              sensible clarification, but repeated reinterpretation should not
              be used to rescue a weak match. An honest search can end with no
              leaf found.
            </p>
            <blockquote>
              “The goal is not to make a leaf fit your life. The goal is to
              discover whether one leaf identifies your life without being
              coached.”
            </blockquote>
          </section>

          <section id="kandams">
            <span>06</span>
            <h2>What are the 13 Kandams?</h2>
            <p>
              Kandam means a section or chapter. Nadi reading systems commonly
              organise material into life areas that parallel familiar themes in
              Indian astrology. Naming and availability can vary, but the
              framework helps seekers choose depth instead of purchasing
              everything without understanding it.
            </p>
            <ol>
              <li>
                <b>General life:</b> identity, broad life pattern and
                foundational overview.
              </li>
              <li>
                <b>Family and wealth:</b> speech, resources and immediate
                family.
              </li>
              <li>
                <b>Siblings and courage:</b> communication, initiative and
                siblings.
              </li>
              <li>
                <b>Mother and home:</b> property, education, emotional
                foundations and mother.
              </li>
              <li>
                <b>Children and intelligence:</b> children, creativity and
                learning.
              </li>
              <li>
                <b>Health and obstacles:</b> illness, conflict, service and
                challenges.
              </li>
              <li>
                <b>Marriage and partnership:</b> spouse, relationships and
                partnership.
              </li>
              <li>
                <b>Longevity and transformation:</b> major transitions and
                hidden matters.
              </li>
              <li>
                <b>Fortune and dharma:</b> teachers, blessings, pilgrimage and
                purpose.
              </li>
              <li>
                <b>Career and authority:</b> profession, responsibility and
                public life.
              </li>
              <li>
                <b>Gains and aspirations:</b> networks, fulfilment and income.
              </li>
              <li>
                <b>Expenditure and liberation:</b> foreign connections, release
                and spiritual direction.
              </li>
              <li>
                <b>Past-life karma and remedies:</b> traditional karmic
                explanations and prescribed spiritual responses.
              </li>
            </ol>
            <p>
              Remedies may involve prayer, charity, temple worship or other
              spiritual acts. Guruji can explain how a recommended practice
              connects with the matched passage, what it involves and how it
              supports the seeker’s wider journey.
            </p>
          </section>

          <section id="lineages">
            <span>07</span>
            <h2>Agastya, Shiva Vakya and other Nadi lineages</h2>
            <p>
              “Which Nadi is best?” is usually the wrong first question. A
              better question is: what kind of clarity are you seeking, and what
              depth can the available manuscript tradition responsibly offer?
              Lineage names signal sacred attribution and reading character, not
              a universal quality ranking.
            </p>
            <p>
              <Link href="/nadis#shiva">Shiva Vakya Nadi</Link> is presented
              through the dialogue of Lord Shiva and Parvati and is often chosen
              for an expansive view across relationships, work, family karma and
              spiritual direction.{" "}
              <Link href="/nadis#agastya">Agastya Nadi</Link>, associated with
              Sage Agastya, is commonly positioned as a foundational and
              practical life reading. Other offerings may include Vashishta,
              Kakabhushundi, Bhogar, Atri, Bhrigu, Nandi, Dhanvantari, Shukra,
              Thirumoolar and Brahma traditions.
            </p>
            <p>
              Descriptions differ across libraries because collections and
              inherited practices differ. Before selecting, ask what the reading
              includes, whether the leaf search is actually conducted within
              that named collection, how long the session normally lasts and
              what happens if the leaf cannot be verified.
            </p>
          </section>

          <section id="online">
            <span>08</span>
            <h2>Can an online Nadi reading be authentic?</h2>
            <p>
              An online session changes the meeting place, not necessarily the
              manuscript process. The reader can remain with the physical
              library while the seeker joins by video. A clear camera, stable
              audio and competent translation can allow the same yes-or-no
              elimination that would occur across a table.
            </p>
            <p>
              The real question is not “online or in person?” but “what is
              happening behind the screen?” Ask whether a physical leaf is being
              retrieved, whether you will see the manuscript, whether matching
              occurs live and whether the recording or translated notes will be
              provided. A digital appointment should increase transparency, not
              obscure the process.
            </p>
            <p>
              Online access is especially valuable for seekers outside Tamil
              Nadu or India, but convenience should not create urgency. Choose a
              quiet place, keep enough uninterrupted time, use headphones if
              privacy matters and resist the temptation to research every
              possible answer during the call. Presence is more useful than
              performance.
            </p>
          </section>

          <section id="authenticity">
            <span>09</span>
            <h2>
              Is Nadi astrology real? A better way to evaluate the question
            </h2>
            <p>
              Nadi astrology makes spiritual and historical claims that modern
              science has not established. Believers may understand a powerful
              match as evidence of destiny, grace or the sages’ perception.
              Sceptics may consider probability, prior information, suggestive
              questioning, translation flexibility and cold-reading techniques.
              A trustworthy guide should not erase either perspective.
            </p>
            <p>
              You can, however, evaluate the integrity of a specific process.
              Was unnecessary personal information collected before matching?
              Were statements specific? Did several identifiers align on one
              leaf? Were wrong leaves discarded cleanly? Did the reader pressure
              you? Was the no-match and refund policy clear? These questions do
              not settle metaphysics, but they protect your ability to assess
              the encounter honestly.
            </p>
            <h3>Questions to clarify before continuing</h3>
            <ul>
              <li>
                A guaranteed leaf or guaranteed outcome before any search.
              </li>
              <li>Requests for a complete biography before matching.</li>
              <li>
                Remedy recommendations without a clear purpose, practice or price.
              </li>
              <li>
                Repeatedly converting wrong statements into vague “symbolic”
                matches.
              </li>
              <li>
                No written explanation of fees, refunds or what the first
                payment covers.
              </li>
              <li>Pressure to purchase every chapter immediately.</li>
              <li>
                Claims that spiritual guidance should replace professional care.
              </li>
            </ul>
          </section>

          <section id="prepare">
            <span>10</span>
            <h2>How to prepare for your first Nadi search</h2>
            <p>
              Begin by writing down what you want from the experience.
              Curiosity, spiritual reflection and a desire for direction are
              different intentions. A clear intention helps you choose a lineage
              and reading depth later without forcing the matching session to
              answer every question at once.
            </p>
            <p>
              Read the centre’s process and refund policy before paying. Confirm
              what the leaf-finding fee covers, which thumb to submit, how the
              call will be arranged, what languages are available and whether
              the full reading is optional. Save the confirmation and support
              contact.
            </p>
            <p>
              During matching, protect the information boundary. Give the
              minimum required booking details, answer yes or no, and ask for
              repetition when necessary. After a match, take a pause. Understand
              the proposed reading, its chapters, duration and price. Spiritual
              significance does not require an impulsive decision.
            </p>
            <div className="blog-checklist">
              <h3>A five-minute checklist</h3>
              <p>
                ✓ Clear thumb impression
                <br />✓ Quiet room and stable connection
                <br />✓ No biography prepared for the reader
                <br />✓ Written refund and pricing terms reviewed
                <br />✓ Freedom to continue—or stop—after matching
              </p>
            </div>
          </section>

          <section>
            <span>11</span>
            <h2>What Nadi astrology can—and cannot—offer</h2>
            <p>
              At its best, a Nadi reading can become a structured moment of
              reflection: a way to examine choices, relationships, obligations
              and spiritual practice through an inherited cultural lens. For a
              believer, it may feel like recognition across centuries. For a
              curious visitor, the matching process itself may be the central
              experience.
            </p>
            <p>
              Nadi guidance can bring a meaningful spiritual perspective to
              life’s uncertainty. Predictions illuminate possible periods and
              patterns, while remedies translate the message into prayer,
              discipline, charity or worship that the seeker can practise with
              understanding.
            </p>
            <p>
              The most respectful approach is neither blind belief nor automatic
              dismissal. Learn the process. Protect the matching conditions.
              Notice what is specific and what is broad. Ask how the tradition
              is being represented. Then decide what meaning, if any, the
              experience holds for you.
            </p>
          </section>

          <section id="faq" className="long-blog-faq">
            <span>12</span>
            <h2>Frequently asked questions</h2>
            {faq.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </section>

          <section className="blog-sources">
            <span>Continue reading</span>
            <h2>Explore the parts of the Nadi journey</h2>
            <p>Go deeper into the three questions most seekers ask next: how the leaf is found, what the chapters contain and how to prepare.</p>
            <ul>
              <li><Link href="/blogs/nadi-astrology-thumb-impression">How thumb-impression matching works</Link></li>
              <li><Link href="/blogs/nadi-astrology-kandams">What the sixteen Kandams cover</Link></li>
              <li><Link href="/blogs/how-to-prepare-for-nadi-astrology-reading">How to prepare for your reading</Link></li>
            </ul>
          </section>

          <div className="article-next">
            <small>Your first step is only the search</small>
            <h2>Could one of the leaves identify you?</h2>
            <p>
              Begin leaf finding for ₹999. If no matching leaf is found, the fee
              is refunded. Full readings are optional and paid only after a
              successful match.
            </p>
            <Link href="/journey" className="lux-btn">
              Begin leaf finding <span>→</span>
            </Link>
          </div>
        </article>
      </div>
      <SiteFooter />
    </main>
  );
}

export async function generateMetadata(){const {post}=await getCmsBlog('what-is-nadi-astrology-complete-guide');return post?cmsMetadata(post):fallbackMetadata}
export default async function Page(){const {managed,post}=await getCmsBlog('what-is-nadi-astrology-complete-guide');if(post)return <CmsBlogArticle post={post}/>;if(managed)notFound();return <StaticPage/>}
