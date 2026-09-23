/** Cloudflare Worker entry point for the vinext-starter template. */
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Until the production D1/R2 data and provider secrets are migrated into
    // this Cloudflare account, keep all stateful operations on the proven live
    // backend. The browser still talks to the current host, so cookies and
    // same-origin flows continue to work while every page and asset is served
    // from this GitHub-managed deployment.
    if (url.pathname.startsWith("/api/") || url.pathname === "/_vinext/image") {
      const backendUrl = new URL(url.pathname + url.search, "https://www.nadivedas.com");
      const headers = new Headers(request.headers);
      headers.set("host", backendUrl.host);
      headers.set("x-forwarded-host", url.host);
      return fetch(new Request(backendUrl, { method: request.method, headers, body: request.body, redirect: "manual" }));
    }

    // Keep a single canonical host. Serving both the apex and www hosts with a
    // 200 response caused search engines to cache different favicon identities.
    if (url.hostname === "nadivedas.com") {
      url.hostname = "www.nadivedas.com";
      return Response.redirect(url.toString(), 308);
    }

    // Let mobile browsers hand the card to iOS/Android Contacts instead of
    // treating it as an anonymous download.
    if (url.pathname === "/contact-card") {
      const assetUrl = new URL("/nadivedas-contact.vcf", request.url);
      const asset = await env.ASSETS.fetch(new Request(assetUrl, request));
      const headers = new Headers(asset.headers);
      headers.set("Content-Type", "text/vcard; charset=utf-8");
      headers.set("Content-Disposition", 'inline; filename="NadiVedas.vcf"');
      headers.set("Cache-Control", "public, max-age=300, must-revalidate");
      return new Response(asset.body, { status: asset.status, headers });
    }

    if (url.pathname === "/shiva-nadi" || url.pathname === "/shiva-nadi/") {
      const page=await env.ASSETS.fetch(
        new Request(new URL("/shiva-nadi.html", request.url), request),
      );
      return new HTMLRewriter()
        .on("head",{element(element){element.append('<script src="/geo-pricing.js"></script>',{html:true})}})
        .on("body",{element(element){element.append('<script src="/shiva-chatbot.js"></script>',{html:true})}})
        .transform(page);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
