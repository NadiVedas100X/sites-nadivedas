ALTER TABLE `leads` ADD `crm_synced` integer NOT NULL DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `leads` ADD `crm_error` text;
