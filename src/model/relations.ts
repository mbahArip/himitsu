import { relations } from "drizzle-orm";
import {
	accountModel,
	apiKeyModel,
	sessionModel,
	userModel,
} from "~/model/auth";
import { environmentModel, folderModel } from "~/model/environment";

export const userRelations = relations(userModel, (ctx) => ({
	sessions: ctx.many(sessionModel),
	accounts: ctx.many(accountModel),
	apiKeys: ctx.many(apiKeyModel),
	folders: ctx.many(folderModel),
	envs: ctx.many(environmentModel),
}));

export const sessionRelations = relations(sessionModel, (ctx) => ({
	user: ctx.one(userModel, {
		fields: [sessionModel.userId],
		references: [userModel.id],
	}),
}));

export const accountRelations = relations(accountModel, (ctx) => ({
	user: ctx.one(userModel, {
		fields: [accountModel.userId],
		references: [userModel.id],
	}),
}));

export const apiKeyRelations = relations(apiKeyModel, (ctx) => ({
	user: ctx.one(userModel, {
		fields: [apiKeyModel.userId],
		references: [userModel.id],
	}),
}));

export const folderRelations = relations(folderModel, (ctx) => ({
	user: ctx.one(userModel, {
		fields: [folderModel.userId],
		references: [userModel.id],
	}),
	envs: ctx.many(environmentModel, {
		relationName: "folderEnvsRelation",
	}),
}));

export const environmentRelations = relations(environmentModel, (ctx) => ({
	user: ctx.one(userModel, {
		fields: [environmentModel.userId],
		references: [userModel.id],
	}),
	folder: ctx.one(folderModel, {
		fields: [environmentModel.folderId],
		references: [folderModel.id],
		relationName: "folderEnvsRelation",
	}),
}));
