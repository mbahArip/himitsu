import type { environmentModel, folderModel } from "~/model";

export const fetchAllEnvironments = async (endpoint: URL | string) => {
	const res = await fetch(endpoint, {
		credentials: "include",
	}).then(
		(res) =>
			res.json() as Promise<
				| {
						success: false;
						name: string;
						message: string;
				  }
				| {
						success: true;
						folders: (typeof folderModel.$inferSelect & {
							envs: (typeof environmentModel.$inferSelect)[];
						})[];
						envs: (typeof environmentModel.$inferSelect)[];
				  }
			>
	);
	if (!res.success) throw new Error(res.message);

	return res;
};
