import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const leads = sqliteTable("leads", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  whatsapp: text("whatsapp").notNull(),
  birthYear: integer("birth_year"),
  gender: text("gender"),
  visitorId: text("visitor_id").notNull().default(""),
  state: text("state").notNull().default(""),
  country: text("country").notNull().default(""),
  metaFbp: text("meta_fbp"),
  metaFbc: text("meta_fbc"),
  clientUserAgent: text("client_user_agent"),
  tiktokTtp: text("tiktok_ttp"),
  tiktokTtclid: text("tiktok_ttclid"),
  clientIp: text("client_ip"),
  languages: text("languages").notNull().default("[]"),
  selectedNadi: text("selected_nadi"),
  paymentTxnid: text("payment_txnid"),
  paymentStatus: text("payment_status"),
  status: text("status").notNull().default("interested"),
  crmSynced: integer("crm_synced").notNull().default(0),
  crmError: text("crm_error"),
  thumbprintKey: text("thumbprint_key"),
  thumbprintName: text("thumbprint_name"),
  sessionAt: integer("session_at"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
});

export const funnelEvents = sqliteTable("funnel_events", {
  id: text("id").primaryKey(), visitorId: text("visitor_id").notNull(), leadId: text("lead_id").notNull().default(""),
  event: text("event").notNull(), path: text("path").notNull().default(""), referrer: text("referrer").notNull().default(""), createdAt: integer("created_at").notNull(),
});

export const metaPurchaseDeliveries = sqliteTable("meta_purchase_deliveries", {
  transactionId: text("transaction_id").primaryKey(),
  leadId: text("lead_id").notNull(),
  amount: text("amount").notNull(),
  currency: text("currency").notNull().default("INR"),
  status: text("status").notNull().default("pending"),
  attempts: integer("attempts").notNull().default(0),
  metaResponse: text("meta_response"),
  lastError: text("last_error"),
  createdAt: integer("created_at").notNull(),
  sentAt: integer("sent_at"),
});

export const tiktokEventDeliveries = sqliteTable("tiktok_event_deliveries", {
  eventId:text("event_id").primaryKey(),leadId:text("lead_id").notNull(),eventName:text("event_name").notNull(),value:text("value").notNull(),currency:text("currency").notNull().default("USD"),status:text("status").notNull().default("pending"),attempts:integer("attempts").notNull().default(0),apiResponse:text("api_response"),lastError:text("last_error"),createdAt:integer("created_at").notNull(),sentAt:integer("sent_at")
});
