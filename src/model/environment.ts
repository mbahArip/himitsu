import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { generateNanoId } from "~/lib/utils";
import { userModel } from "~/model/auth";

export const environmentFolderModel = sqliteTable(
	"environment_folder",
	{
		id: text("id").primaryKey().$defaultFn(generateNanoId),
		userId: text("user_id")
			.notNull()
			.references(() => userModel.id, { onDelete: "cascade" }),
		keyId: text("key_id").references(() => keyAccessModel.id, {
			onDelete: "set null",
		}),

		name: text("name").notNull(),
		/**
		 * Private folder need token or auth to access
		 * Public folder can be accessed by anyone
		 */
		privacy: text("privacy", { enum: ["public", "private"] })
			.notNull()
			.default("private"),
		/**
		 * Custom color for the folder in hex format
		 */
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
	keyId: text("key_id").references(() => keyAccessModel.id, {
		onDelete: "set null",
	}),

	name: text("name").notNull(),
	description: text("description"),

	privacy: text("privacy", { enum: ["public", "private"] })
		.notNull()
		.default("private"),
	/**
	 * Encrypted environment variables
	 */
	content: text("content", {
		mode: "json",
	})
		.notNull()
		.$type<
			{
				key: string;
				label: string;
				description?: string;
				encryptedValue: string;
			}[]
		>(),

	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
});

export const keyAccessModel = sqliteTable("key_access", {
	id: text("id").primaryKey().$defaultFn(generateNanoId),
	userId: text("user_id")
		.notNull()
		.references(() => userModel.id, { onDelete: "cascade" }),

	key: text("key").notNull(),
	description: text("description"),
	value: text("value")
		.notNull()
		.$defaultFn(() =>
			generateNanoId({ length: 32, characters: "1234567890abcdefABCDEF" })
		),

	usage: integer("usage", { mode: "number" }).notNull().default(0),

	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.$defaultFn(() => new Date()),
	expiresAt: integer("expires_at", { mode: "timestamp" }), // In case of a time-limited access
});
