DROP INDEX "idx_account_user_id";--> statement-breakpoint
DROP INDEX "apiKey_key_unique";--> statement-breakpoint
DROP INDEX "idx_apiKey_user_id";--> statement-breakpoint
DROP INDEX "idx_apiKey_key";--> statement-breakpoint
DROP INDEX "rateLimit_key_unique";--> statement-breakpoint
DROP INDEX "session_token_unique";--> statement-breakpoint
DROP INDEX "idx_session_token";--> statement-breakpoint
DROP INDEX "idx_session_user_id";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
DROP INDEX "idx_user_email";--> statement-breakpoint
DROP INDEX "idx_verification_identifier";--> statement-breakpoint
ALTER TABLE `rateLimit` ALTER COLUMN "last_request" TO "last_request" integer NOT NULL;--> statement-breakpoint
CREATE INDEX `idx_account_user_id` ON `account` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `apiKey_key_unique` ON `apiKey` (`key`);--> statement-breakpoint
CREATE INDEX `idx_apiKey_user_id` ON `apiKey` (`user_id`);--> statement-breakpoint
CREATE INDEX `idx_apiKey_key` ON `apiKey` (`key`);--> statement-breakpoint
CREATE UNIQUE INDEX `rateLimit_key_unique` ON `rateLimit` (`key`);--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `idx_session_token` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `idx_session_user_id` ON `session` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `idx_user_email` ON `user` (`email`);--> statement-breakpoint
CREATE INDEX `idx_verification_identifier` ON `verification` (`identifier`);