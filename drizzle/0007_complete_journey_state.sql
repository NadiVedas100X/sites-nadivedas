ALTER TABLE `leads` ADD `referral_token` text;
--> statement-breakpoint
ALTER TABLE `leads` ADD `nadi_decided` integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `leads` ADD `initial_interest` text;
--> statement-breakpoint
ALTER TABLE `leads` ADD `pricing_country` text;
--> statement-breakpoint
ALTER TABLE `leads` ADD `pricing_region` text;
--> statement-breakpoint
ALTER TABLE `leads` ADD `pricing_currency` text;
--> statement-breakpoint
ALTER TABLE `leads` ADD `pricing_rate` real;
--> statement-breakpoint
ALTER TABLE `leads` ADD `pricing_multiplier` real;
--> statement-breakpoint
ALTER TABLE `leads` ADD `leaf_finding_amount` real;
--> statement-breakpoint
ALTER TABLE `leads` ADD `offer_expires_at` integer;
--> statement-breakpoint
ALTER TABLE `leads` ADD `payment_amount` real;
--> statement-breakpoint
ALTER TABLE `leads` ADD `payment_currency` text;
--> statement-breakpoint
ALTER TABLE `leads` ADD `refund_requested` integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `leads` ADD `refund_status` text;
--> statement-breakpoint
ALTER TABLE `leads` ADD `session_selected_at` integer;
--> statement-breakpoint
ALTER TABLE `leads` ADD `followup_consent` integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `leads` ADD `consent_at` integer;
--> statement-breakpoint
ALTER TABLE `leads` ADD `visitor_id` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `leads` ADD `state` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `leads` ADD `country` text NOT NULL DEFAULT '';
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `idx_leads_created_at` ON `leads` (`created_at`);
