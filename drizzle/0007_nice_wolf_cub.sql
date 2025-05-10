PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_environment_folder` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`key_id` text,
	`name` text NOT NULL,
	`privacy` text DEFAULT 'private' NOT NULL,
	`color` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`key_id`) REFERENCES `key_access`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_environment_folder`("id", "user_id", "key_id", "name", "privacy", "color", "created_at", "updated_at") SELECT "id", "user_id", "key_id", "name", "privacy", "color", "created_at", "updated_at" FROM `environment_folder`;--> statement-breakpoint
DROP TABLE `environment_folder`;--> statement-breakpoint
ALTER TABLE `__new_environment_folder` RENAME TO `environment_folder`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `idx_environment_folder_id` ON `environment_folder` (`id`);--> statement-breakpoint
CREATE INDEX `idx_environment_folder_user_id` ON `environment_folder` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_environment_folder_name` ON `environment_folder` (`name`);