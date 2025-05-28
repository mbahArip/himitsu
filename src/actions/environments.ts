"use server";

import { protectedActionClient } from "~/lib/safe-action";
import {
	GetEnvironmentsInputSchema,
	type GetEnvironmentsOutputSchema,
} from "~/types/schema";

export const getEnvironmentsAction = protectedActionClient
	.metadata({
		name: "getEnvironments",
		path: "environments.getEnvironments",
	})
	.schema(GetEnvironmentsInputSchema)
	.stateAction<GetEnvironmentsOutputSchema>(async (data) => {
		const $folders = data.ctx.db.query.environmentFolderModel
			.findMany({
				columns: {
					id: true,
					name: true,
					color: true,
					createdAt: true,
					updatedAt: true,
				},
				where: (self, { eq }) =>
					eq(self.userId, data.ctx.session.user.id),
				orderBy: (self, { asc }) => asc(self.name),
				with: {
					envs: {
						columns: {
							id: true,
							name: true,
							description: true,
							createdAt: true,
							updatedAt: true,
						},
						orderBy: (self, { asc }) => asc(self.name),
					},
				},
			})
			.catch((error) => {
				console.error("Failed to get root folders", error);
				return [];
			});
		const $files = data.ctx.db.query.environmentModel
			.findMany({
				columns: {
					id: true,
					name: true,
					description: true,
					createdAt: true,
					updatedAt: true,
				},
				where: (self, { eq, and, isNull }) =>
					and(
						eq(self.userId, data.ctx.session.user.id),
						isNull(self.folderId)
					),
				orderBy: (self, { asc }) => asc(self.name),
			})
			.catch(() => {
				console.error("Failed to get root environments");
				return [];
			});

		const [folders, files] = await Promise.all([$folders, $files]);

		return {
			folders,
			files,
		};
	});
