import { sql } from "drizzle-orm";
import {
	boolean,
	integer,
	json,
	pgTable,
	text,
	timestamp,
} from "drizzle-orm/pg-core";

export const userModel = pgTable("user", {
	id: text("id").primaryKey(),

	name: text("name").notNull(),
	email: text("email").notNull().unique(),
	emailVerified: boolean("email_verified").notNull().default(false),
	avatar: text("avatar"),

	/**
	 * Admin Plugin
	 */
	role: text("role"),
	banned: boolean("banned"),
	banReason: text("ban_reason"),
	banExpires: timestamp("ban_expires", { mode: "string" }),

	createdAt: timestamp("created_at", { mode: "string" })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" })
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => sql`now()`),
});

export const sessionModel = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userModel.id, { onDelete: "cascade" }),

	token: text("token").notNull().unique(),
	expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),
	ipAddress: text("ip_address"),
	userAgent: text("user_agent"),

	/**
	 * Admin Plugin
	 */
	impersonatedBy: text("impersonated_by"),

	createdAt: timestamp("created_at", { mode: "string" })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" })
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => sql`now()`),
});

export const accountModel = pgTable("account", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userModel.id, { onDelete: "cascade" }),

	accountId: text("account_id").notNull(),
	providerId: text("provider_id").notNull(),
	accessToken: text("access_token"),
	refreshToken: text("refresh_token"),
	accessTokenExpiresAt: timestamp("access_token_expires_at", {
		mode: "string",
	}),
	refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
		mode: "string",
	}),
	scope: text("scope"),
	idToken: text("id_token"),
	password: text("password"),

	createdAt: timestamp("created_at", { mode: "string" })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" })
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => sql`now()`),
});

export const verificationModel = pgTable("verification", {
	id: text("id").primaryKey(),

	identifier: text("identifier").notNull(),
	value: text("value").notNull(),
	expiresAt: timestamp("expires_at", { mode: "string" }).notNull(),

	createdAt: timestamp("created_at", { mode: "string" })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" })
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => sql`now()`),
});

export const rateLimitModel = pgTable("rateLimit", {
	id: text("id").primaryKey(),
	key: text("key").notNull().unique(),
	count: integer("count").notNull(),
	lastRequest: timestamp("last_request", { mode: "string" })
		.notNull()
		.defaultNow(),
});

export const apiKeyModel = pgTable("apiKey", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => userModel.id, { onDelete: "cascade" }),

	enabled: boolean("enabled").notNull().default(true),
	name: text("name"),
	start: text("start"),
	prefix: text("prefix"),
	key: text("key").notNull().unique(),
	refillInterval: integer("refill_interval"),
	refillAmount: integer("refill_amount"),
	lastRefillAt: timestamp("last_refill_at", { mode: "string" }),
	expiresAt: timestamp("expires_at", { mode: "string" }),
	permissions: text("permissions"),
	metadata: json("metadata").$type<Record<string, unknown>>(),

	rateLimitEnabled: boolean("rate_limit_enabled").notNull().default(false),
	rateLimitTimeWindow: integer("rate_limit_time_window"),
	rateLimitMax: integer("rate_limit_max"),
	requestCount: integer("request_count").notNull().default(0),
	remaining: integer("remaining"),
	lastRequest: timestamp("last_request", { mode: "string" }),

	createdAt: timestamp("created_at", { mode: "string" })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" })
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => sql`now()`),
});
