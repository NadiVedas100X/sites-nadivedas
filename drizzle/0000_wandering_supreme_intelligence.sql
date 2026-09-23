CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`whatsapp` text NOT NULL,
	`selected_nadi` text,
	`status` text DEFAULT 'interested' NOT NULL,
	`created_at` integer NOT NULL
);
