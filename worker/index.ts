/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
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

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
