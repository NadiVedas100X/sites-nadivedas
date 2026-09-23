export const runtime = "edge";

import { publishedTestimonials } from "../../data/publishedTestimonials";

export async function GET() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(
      "https://poojacrm.nadivedas.com/api/testimonials?public=1",
      {
        cache: "no-store",
        signal: controller.signal,
      },
    );
    if (!response.ok) {
      throw new Error(`Testimonials upstream returned ${response.status}`);
    }
    const payload = await response.json() as { items?: unknown[] };
    const items = Array.isArray(payload.items) ? payload.items : [];
    if (items.length < 50) throw new Error("Testimonials upstream returned an incomplete catalogue");
    return Response.json({ items, complete: true }, {
      headers: {
        "cache-control": "public, max-age=60, s-maxage=300, stale-while-revalidate=86400",
        "cdn-cache-control": "public, max-age=300, stale-while-revalidate=86400",
      },
    });
  } catch {
    return Response.json(
      { items: publishedTestimonials, complete: false },
      { headers: { "cache-control": "no-store" } },
    );
  } finally {
    clearTimeout(timeout);
  }
}
