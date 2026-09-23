import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Images are already compressed for production. Serving them directly avoids
  // the hosting image proxy rejecting WebP sources and keeps every card visible.
  images: { unoptimized: true },
  async headers() {
    return [
      {
        source: "/",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=86400, stale-while-revalidate=604800" },
          { key: "CDN-Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      {
        source: "/reviews",
        headers: [
          { key: "Cache-Control", value: "public, max-age=0, s-maxage=300, stale-while-revalidate=86400" },
          { key: "CDN-Cache-Control", value: "public, max-age=300, stale-while-revalidate=86400" },
        ],
      },
      {
        source: "/assets/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
