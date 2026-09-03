CREATE TABLE `site_admins` (
	`user_id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `site_content` (
	`id` text PRIMARY KEY NOT NULL,
	`content` text NOT NULL,
	`updated_at` integer NOT NULL,
	`updated_by` text NOT NULL
);
