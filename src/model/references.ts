import { relations } from "drizzle-orm";
import * as model from "~/model";

export const usersRelations = relations(model.userModel, (ctx) => ({
	sessions: ctx.many(model.sessionModel, {
		relationName: "userSessions",
	}),
	accounts: ctx.many(model.accountModel, {
		relationName: "userAccounts",
	}),
	apiKeys: ctx.many(model.apiKeyModel, {
		relationName: "userApiKeys",
	}),

	envFolders: ctx.many(model.environmentFolderModel, {
		relationName: "userEnvFolders",
	}),
	envs: ctx.many(model.environmentModel, {
		relationName: "userEnvs",
	}),
}));

export const sessionsRelations = relations(model.sessionModel, (ctx) => ({
	user: ctx.one(model.userModel, {
		fields: [model.sessionModel.userId],
		references: [model.userModel.id],
		relationName: "sessionUser",
	}),
	impersonatedBy: ctx.one(model.userModel, {
		fields: [model.sessionModel.impersonatedBy],
		references: [model.userModel.id],
		relationName: "sessionImpersonatedBy",
	}),
}));

export const accountsRelations = relations(model.accountModel, (ctx) => ({
	user: ctx.one(model.userModel, {
		fields: [model.accountModel.userId],
		references: [model.userModel.id],
		relationName: "accountUser",
	}),
}));

export const apiKeysRelations = relations(model.apiKeyModel, (ctx) => ({
	user: ctx.one(model.userModel, {
		fields: [model.apiKeyModel.userId],
		references: [model.userModel.id],
		relationName: "apiKeyUser",
	}),
}));

export const envFoldersRelations = relations(
	model.environmentFolderModel,
	(ctx) => ({
		user: ctx.one(model.userModel, {
			fields: [model.environmentFolderModel.userId],
			references: [model.userModel.id],
			relationName: "envFolderUser",
		}),
		envs: ctx.many(model.environmentModel, {
			relationName: "envFolderEnvs",
		}),
	})
);

export const envsRelations = relations(model.environmentModel, (ctx) => ({
	user: ctx.one(model.userModel, {
		fields: [model.environmentModel.userId],
		references: [model.userModel.id],
		relationName: "envUser",
	}),
	folder: ctx.one(model.environmentFolderModel, {
		fields: [model.environmentModel.folderId],
		references: [model.environmentFolderModel.id],
		relationName: "envFolder",
	}),
}));
