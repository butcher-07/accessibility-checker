CREATE TABLE `urls` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`url` text NOT NULL,
	`parent_url` text,
	`domain` text NOT NULL,
	`processed` integer DEFAULT false,
	`created_at` integer DEFAULT '"2025-09-12T09:53:57.024Z"'
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);