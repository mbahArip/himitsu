import { relations } from "drizzle-orm";
import * as model from "~/model";

export const usersRelations = relations(model.userModel, (ctx) => ({
	sessions: ctx.many(model.sessionModel),
	accounts: ctx.many(model.accountModel),
	apiKeys: ctx.many(model.apiKeyModel),

	envFolders: ctx.many(model.environmentFolderModel),
	envs: ctx.many(model.environmentModel),
	keyAccess: ctx.many(model.keyAccessModel),
}));

export const sessionsRelations = relations(model.sessionModel, (ctx) => ({
	user: ctx.one(model.userModel, {
		fields: [model.sessionModel.userId],
		references: [model.userModel.id],
	}),
	impersonatedBy: ctx.one(model.userModel, {
		fields: [model.sessionModel.impersonatedBy],
		references: [model.userModel.id],
	}),
}));

export const accountsRelations = relations(model.accountModel, (ctx) => ({
	user: ctx.one(model.userModel, {
		fields: [model.accountModel.userId],
		references: [model.userModel.id],
	}),
}));

export const apiKeysRelations = relations(model.apiKeyModel, (ctx) => ({
	user: ctx.one(model.userModel, {
		fields: [model.apiKeyModel.userId],
		references: [model.userModel.id],
	}),
}));

export const envFoldersRelations = relations(
	model.environmentFolderModel,
	(ctx) => ({
		user: ctx.one(model.userModel, {
			fields: [model.environmentFolderModel.userId],
			references: [model.userModel.id],
		}),
		envs: ctx.many(model.environmentModel),
		keyAccess: ctx.one(model.keyAccessModel, {
			fields: [model.environmentFolderModel.keyId],
			references: [model.keyAccessModel.id],
		}),
	})
);

export const envsRelations = relations(model.environmentModel, (ctx) => ({
	user: ctx.one(model.userModel, {
		fields: [model.environmentModel.userId],
		references: [model.userModel.id],
	}),
	folder: ctx.one(model.environmentFolderModel, {
		fields: [model.environmentModel.folderId],
		references: [model.environmentFolderModel.id],
	}),
	keyAccess: ctx.one(model.keyAccessModel, {
		fields: [model.environmentModel.keyId],
		references: [model.keyAccessModel.id],
	}),
}));

export const keyAccessRelations = relations(model.keyAccessModel, (ctx) => ({
	user: ctx.one(model.userModel, {
		fields: [model.keyAccessModel.userId],
		references: [model.userModel.id],
	}),
	envFolders: ctx.many(model.environmentFolderModel),
	envs: ctx.many(model.environmentModel),
}));
