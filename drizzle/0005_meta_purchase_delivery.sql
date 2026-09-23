CREATE TABLE IF NOT EXISTS `meta_purchase_deliveries` (
  `transaction_id` text PRIMARY KEY NOT NULL,
  `lead_id` text NOT NULL,
  `amount` text NOT NULL,
  `currency` text DEFAULT 'INR' NOT NULL,
  `status` text DEFAULT 'pending' NOT NULL,
  `attempts` integer DEFAULT 0 NOT NULL,
  `meta_response` text,
  `last_error` text,
  `created_at` integer NOT NULL,
  `sent_at` integer
);
--> statement-breakpoint
ALTER TABLE `leads` ADD `meta_fbp` text;
--> statement-breakpoint
ALTER TABLE `leads` ADD `meta_fbc` text;
--> statement-breakpoint
ALTER TABLE `leads` ADD `client_user_agent` text;
