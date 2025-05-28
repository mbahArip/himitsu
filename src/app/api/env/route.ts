import { NextResponse, type NextRequest } from "next/server";
import { db } from "~/lib/db";
import { isAllowed } from "~/lib/utils.server";

export async function GET(request: NextRequest) {
	const { allowed, user } = await isAllowed(request);
	if (!allowed || !user)
		return NextResponse.json(
			{
				success: false,
				name: "Unauthorized",
				message: "You are not authorized to access this resource.",
			},
			{ status: 401 }
		);

	const sp = request.nextUrl.searchParams;
	const search = sp.get("search") || undefined;

	try {
		const data = await db.transaction((trx) => {
			const $folders = trx.query.folderModel.findMany({
				where: (self, ctx) =>
					ctx.and(
						ctx.eq(self.userId, user.id),
						search ? ctx.ilike(self.name, `%${search}%`) : undefined
					),
				orderBy: (self, ctx) => ctx.asc(self.name),
				limit: 999,
				with: {
					envs: {
						where: (self, ctx) =>
							ctx.and(
								ctx.eq(self.userId, user.id),
								search
									? ctx.ilike(self.name, `%${search}%`)
									: undefined
							),
						limit: 999,
						orderBy: (self, ctx) => ctx.asc(self.name),
					},
				},
			});
			const $envs = trx.query.environmentModel.findMany({
				where: (self, ctx) =>
					ctx.and(
						ctx.eq(self.userId, user.id),
						ctx.isNull(self.folderId),
						search ? ctx.ilike(self.name, `%${search}%`) : undefined
					),
				orderBy: (self, ctx) => ctx.asc(self.name),
				limit: 999,
				with: {
					folder: {
						columns: {
							name: true,
						},
					},
				},
			});
			return Promise.all([$folders, $envs]);
		});

		return NextResponse.json(
			{
				success: true,
				folders: data[0],
				envs: data[1],
			},
			{ status: 200 }
		);
	} catch (error: unknown) {
		const err = error as Error;
		return NextResponse.json(
			{
				success: false,
				name: err.name,
				message: err.message,
			},
			{ status: 500 }
		);
	}
}
