import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const userModel = sqliteTable(
	"user",
	{
		id: text("id").primaryKey(),

		name: text("name").notNull(),
		email: text("email").notNull().unique(),
		emailVerified: integer("email_verified", { mode: "boolean" })
			.notNull()
			.default(false),
		avatar: text("avatar"),

		/**
		 * Admin Plugin
		 */
		role: text("role"),
		banned: integer("banned", { mode: "boolean" }),
		banReason: text("ban_reason"),
		banExpires: integer("ban_expires", { mode: "timestamp" }),

		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(self) => [index("idx_user_email").on(self.email)]
);

export const sessionModel = sqliteTable(
	"session",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => userModel.id, { onDelete: "cascade" }),

		token: text("token").notNull().unique(),
		expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),

		/**
		 * Admin Plugin
		 */
		impersonatedBy: text("impersonated_by"),

		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(self) => [
		index("idx_session_token").on(self.token),
		index("idx_session_user_id").on(self.userId),
	]
);

export const accountModel = sqliteTable(
	"account",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => userModel.id, { onDelete: "cascade" }),

		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		accessTokenExpiresAt: integer("access_token_expires_at", {
			mode: "timestamp",
		}),
		refreshTokenExpiresAt: integer("refresh_token_expires_at", {
			mode: "timestamp",
		}),
		scope: text("scope"),
		idToken: text("id_token"),
		password: text("password"),

		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(self) => [index("idx_account_user_id").on(self.userId)]
);

export const verificationModel = sqliteTable(
	"verification",
	{
		id: text("id").primaryKey(),

		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: integer("expires_at", { mode: "timestamp" }).notNull(),

		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(self) => [index("idx_verification_identifier").on(self.identifier)]
);

export const rateLimitModel = sqliteTable("rateLimit", {
	id: text("id").primaryKey(),
	key: text("key").notNull().unique(),
	count: integer("count", { mode: "number" }).notNull(),
	lastRequest: integer("last_request", { mode: "timestamp" }).notNull(),
});

export const apiKeyModel = sqliteTable(
	"apiKey",
	{
		id: text("id").primaryKey(),
		userId: text("user_id")
			.notNull()
			.references(() => userModel.id, { onDelete: "cascade" }),

		enabled: integer("enabled", { mode: "boolean" })
			.notNull()
			.default(true),
		name: text("name"),
		start: text("start"),
		prefix: text("prefix"),
		key: text("key").notNull().unique(),
		refillInterval: integer("refill_interval", { mode: "number" }),
		refillAmount: integer("refill_amount", { mode: "number" }),
		lastRefillAt: integer("last_refill_at", { mode: "timestamp" }),
		expiresAt: integer("expires_at", { mode: "timestamp" }),
		permissions: text("permissions"),
		metadata: text("metadata", { mode: "json" }).$type<
			Record<string, unknown>
		>(),

		rateLimitEnabled: integer("rate_limit_enabled", { mode: "boolean" })
			.notNull()
			.default(false),
		rateLimitTimeWindow: integer("rate_limit_time_window", {
			mode: "number",
		}),
		rateLimitMax: integer("rate_limit_max", { mode: "number" }),
		requestCount: integer("request_count", { mode: "number" })
			.notNull()
			.default(0),
		remaining: integer("remaining", { mode: "number" }),
		lastRequest: integer("last_request", { mode: "timestamp" }),

		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(self) => [
		index("idx_apiKey_user_id").on(self.userId),
		index("idx_apiKey_key").on(self.key),
	]
);
