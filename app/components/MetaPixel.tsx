"use client";

import { useEffect } from "react";

declare global {
  interface Window { fbq?: (...args: unknown[]) => void; _fbq?: unknown }
}

const PIXEL_ID = "424480907320631";

export function MetaPixel() {
  useEffect(() => {
    let cancelled = false;
    const start = async () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tracking") === "off") return;
    const lead = params.get("payment") === "success" ? params.get("lead") : null;
    if (lead) {
      const data = await fetch(`/api/leads?id=${encodeURIComponent(lead)}`, { cache: "no-store" }).then(r => r.ok ? r.json() : null).catch(() => null);
      if (data?.lead?.trackingExcluded || cancelled) return;
    }
    if (window.fbq || cancelled) return;
    const fbq = function (...args: unknown[]) {
      const self = fbq as typeof fbq & { callMethod?: (...values: unknown[]) => void; queue?: unknown[][]; loaded?: boolean; version?: string };
      if (self.callMethod) self.callMethod(...args);
      else (self.queue ||= []).push(args);
    };
    Object.assign(fbq, { push: fbq, loaded: true, version: "2.0", queue: [] });
    window.fbq = fbq;
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
    fbq("init", PIXEL_ID);
    fbq("track", "PageView");
    };
    void start();
    return () => { cancelled = true; };
  }, []);
  return null;
}
