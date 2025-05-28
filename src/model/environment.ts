import { sql } from "drizzle-orm";
import { json, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import type { z } from "zod";
import { userModel } from "~/model/auth";
import type { EnvironmentSchema } from "~/types/schema";

export const folderModel = pgTable("folder", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id")
		.notNull()
		.references(() => userModel.id, { onDelete: "cascade" }),

	name: text("name").notNull(),
	color: text("color"),

	createdAt: timestamp("created_at", { mode: "string" })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" })
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => sql`now()`),
});

export const environmentModel = pgTable("environment", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: text("user_id")
		.notNull()
		.references(() => userModel.id, { onDelete: "cascade" }),
	folderId: uuid("folder_id").references(() => folderModel.id, {
		onDelete: "cascade",
	}),

	name: text("name").notNull(),
	description: text("description"),

	privacy: text("privacy", { enum: ["public", "private"] })
		.notNull()
		.default("private"),
	content: json("content")
		.notNull()
		.$type<z.infer<typeof EnvironmentSchema>[]>(),

	createdAt: timestamp("created_at", { mode: "string" })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { mode: "string" })
		.notNull()
		.defaultNow()
		.$onUpdateFn(() => sql`now()`),
});
