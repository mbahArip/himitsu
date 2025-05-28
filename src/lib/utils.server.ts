"use server";
import type { NextRequest } from "next/server";
import { auth } from "~/lib/auth";
import { db } from "~/lib/db";

export async function isAllowed(
	request: NextRequest,
	permissions?: Record<string, string[]>
): Promise<{
	allowed: boolean;
	user: (typeof auth.$Infer.Session)["user"] | null;
}> {
	let allowed = false;
	let user: (typeof auth.$Infer.Session)["user"] | null = null;
	const apiKey = request.headers.get("x-api-key");
	if (apiKey) {
		const { valid, key } = await auth.api.verifyApiKey({
			body: {
				key: apiKey,
				permissions,
			},
		});
		if (valid && key) {
			allowed = true;
			user =
				(await db.query.userModel.findFirst({
					where: (userModel, { eq }) => eq(userModel.id, key.userId),
				})) ?? null;
		}
	} else {
		const session = await auth.api
			.getSession({
				headers: request.headers,
			})
			.catch(() => null);
		if (session) {
			allowed = true;
			user = session.user;
		}
	}

	return {
		allowed,
		user,
	};
}
