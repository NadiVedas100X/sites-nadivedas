ALTER TABLE `leads` ADD `tiktok_ttp` text;
--> statement-breakpoint
ALTER TABLE `leads` ADD `tiktok_ttclid` text;
--> statement-breakpoint
ALTER TABLE `leads` ADD `client_ip` text;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `tiktok_event_deliveries` (
  `event_id` text PRIMARY KEY NOT NULL,
  `lead_id` text NOT NULL,
  `event_name` text NOT NULL,
  `value` text NOT NULL,
  `currency` text DEFAULT 'USD' NOT NULL,
  `status` text DEFAULT 'pending' NOT NULL,
  `attempts` integer DEFAULT 0 NOT NULL,
  `api_response` text,
  `last_error` text,
  `created_at` integer NOT NULL,
  `sent_at` integer
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `tiktok_event_deliveries_lead_idx` ON `tiktok_event_deliveries` (`lead_id`,`created_at`);
