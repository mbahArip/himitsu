import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import type { z } from "zod";
import { generateNanoId } from "~/lib/utils";
import { userModel } from "~/model/auth";
import type { EnvironmentSchema } from "~/types/schema";

export const environmentFolderModel = sqliteTable(
	"folder",
	{
		id: text("id").primaryKey().$defaultFn(generateNanoId),
		userId: text("user_id")
			.notNull()
			.references(() => userModel.id, { onDelete: "cascade" }),

		name: text("name").notNull(),
		color: text("color"),

		createdAt: integer("created_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
		updatedAt: integer("updated_at", { mode: "timestamp" })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(self) => [
		index("idx_environment_folder_id").on(self.id),
		index("idx_environment_folder_user_id").on(self.userId),
		index("idx_environment_folder_name").on(self.name),
	]
);

export const environmentModel = sqliteTable("environment", {
	id: text("id").primaryKey().$defaultFn(generateNanoId),
	userId: text("user_id")
		.notNull()
		.references(() => userModel.id, { onDelete: "cascade" }),
	folderId: text("folder_id").references(() => environmentFolderModel.id, {
		onDelete: "cascade",
	}),

	name: text("name").notNull(),
	description: text("description"),

	privacy: text("privacy", { enum: ["public", "private"] })
		.notNull()
		.default("private"),
	content: text("content", {
		mode: "json",
	})
		.notNull()
		.$type<z.infer<typeof EnvironmentSchema>[]>(),

	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});
