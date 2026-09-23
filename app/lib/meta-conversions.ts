import { env } from "cloudflare:workers";
import { isInternalTestIdentity } from "./tracking-exclusions";

type Runtime = {
  DB: D1Database;
  META_PIXEL_ID?: string;
  META_CAPI_ACCESS_TOKEN?: string;
  META_CAPI_TEST_EVENT_CODE?: string;
  META_GRAPH_API_VERSION?: string;
};

type Purchase = {
  transactionId: string;
  leadId: string;
  amount: string;
  currency?: string;
  email: string;
  phone: string;
  firstName: string;
  sourceUrl: string;
  fbp?: string;
  fbc?: string;
  clientUserAgent?: string;
};

const encoder = new TextEncoder();
const hex = (buffer: ArrayBuffer) => Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
const sha256 = async (value: string) => hex(await crypto.subtle.digest("SHA-256", encoder.encode(value.trim().toLowerCase())));
const digits = (value: string) => value.replace(/\D/g, "");

export async function sendVerifiedMetaPurchase(purchase: Purchase) {
  if (isInternalTestIdentity(purchase.email, purchase.phone)) {
    return { sent: false, reason: "internal_test_identity" } as const;
  }
  const runtime = env as unknown as Runtime;
  const now = Date.now();

  await runtime.DB.prepare(`
    INSERT OR IGNORE INTO meta_purchase_deliveries
      (transaction_id, lead_id, amount, currency, status, attempts, created_at)
    VALUES (?, ?, ?, ?, 'pending', 0, ?)
  `).bind(purchase.transactionId, purchase.leadId, purchase.amount, purchase.currency||"INR", now).run();

  const claimed = await runtime.DB.prepare(`
    UPDATE meta_purchase_deliveries
    SET status = 'sending', attempts = attempts + 1, last_error = NULL
    WHERE transaction_id = ? AND status IN ('pending', 'failed')
  `).bind(purchase.transactionId).run();

  if (!claimed.meta.changes) return { sent: false, reason: "already_processed" } as const;

  if (!runtime.META_PIXEL_ID || !runtime.META_CAPI_ACCESS_TOKEN) {
    await runtime.DB.prepare("UPDATE meta_purchase_deliveries SET status='failed', last_error=? WHERE transaction_id=?")
      .bind("Meta Conversions API credentials are not configured", purchase.transactionId).run();
    return { sent: false, reason: "not_configured" } as const;
  }

  const phone = digits(purchase.phone);
  const userData: Record<string, string | string[]> = {
    em: [await sha256(purchase.email)],
    external_id: [await sha256(purchase.leadId)],
  };
  if (phone) userData.ph = [await sha256(phone)];
  if (purchase.firstName) userData.fn = [await sha256(purchase.firstName)];
  if (purchase.fbp) userData.fbp = purchase.fbp;
  if (purchase.fbc) userData.fbc = purchase.fbc;
  if (purchase.clientUserAgent) userData.client_user_agent = purchase.clientUserAgent;

  const body: Record<string, unknown> = {
    data: [{
      event_name: "Purchase",
      event_time: Math.floor(now / 1000),
      event_id: purchase.transactionId,
      action_source: "website",
      event_source_url: purchase.sourceUrl,
      user_data: userData,
      custom_data: {
        currency: purchase.currency||"INR",
        value: Number(purchase.amount),
        order_id: purchase.transactionId,
      },
    }],
  };
  if (runtime.META_CAPI_TEST_EVENT_CODE) body.test_event_code = runtime.META_CAPI_TEST_EVENT_CODE;

  try {
    const version = runtime.META_GRAPH_API_VERSION || "v23.0";
    const response = await fetch(`https://graph.facebook.com/${version}/${runtime.META_PIXEL_ID}/events?access_token=${encodeURIComponent(runtime.META_CAPI_ACCESS_TOKEN)}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const responseText = await response.text();
    if (!response.ok) throw new Error(`Meta CAPI ${response.status}: ${responseText.slice(0, 1000)}`);
    await runtime.DB.prepare("UPDATE meta_purchase_deliveries SET status='sent', meta_response=?, sent_at=? WHERE transaction_id=?")
      .bind(responseText.slice(0, 4000), Date.now(), purchase.transactionId).run();
    return { sent: true } as const;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown Meta CAPI error";
    await runtime.DB.prepare("UPDATE meta_purchase_deliveries SET status='failed', last_error=? WHERE transaction_id=?")
      .bind(message.slice(0, 2000), purchase.transactionId).run();
    return { sent: false, reason: "delivery_failed" } as const;
  }
}
