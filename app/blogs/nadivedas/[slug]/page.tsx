import { permanentRedirect } from "next/navigation";

const destinations: Record<string, string> = {
  "vaitheeswaran-koil-nadi-astrology-path-to-source-of-ancient-wisdom": "/blogs/vaitheeswaran-koil-nadi-astrology",
  "the-architect-of-destiny-who-is-sage-agastya-and-why-did-he-write-your-nadi": "/nadis#agastya",
  "what-is-nadi-astrology-and-why-seekers-trust-nadivedas": "/blogs/what-is-nadi-astrology-complete-guide",
  "the-souls-library-decoding-the-diverse-lineages-and-types-of-nadi-astrology": "/nadis",
  "palm-leaf-nadi-astrology-full-details": "/blogs/what-is-nadi-astrology-complete-guide",
  "beyond-the-birth-chart-decoding-your-souls-blueprint-through-vaitheeswaran-koil-nadi-astrology": "/blogs/vaitheeswaran-koil-nadi-astrology",
  "nadivedas-science-of-nadi-reading": "/blogs/nadi-astrology-history",
  "was-your-destiny-written-2000-years-ago-the-mystery-of-nadi-astrology": "/blogs/nadi-astrology-history",
  "vaitheeswaran-koil-nadi-astrology-5-emotional-journeys-of-seekers-who-found-their-ancient-soul-blueprint-with-nadivedas": "/reviews",
};

export function generateStaticParams() { return Object.keys(destinations).map(slug => ({ slug })); }
export default async function Page({ params }: { params: Promise<{ slug: string }> }) { const { slug } = await params; permanentRedirect(destinations[slug] || "/blogs"); }
