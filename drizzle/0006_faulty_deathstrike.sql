ALTER TABLE `environment_folder` ADD `key_id` text REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `environment` ADD `key_id` text REFERENCES key_access(id);--> statement-breakpoint
ALTER TABLE `key_access` DROP COLUMN `used_for`;