import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, apiKey } from "better-auth/plugins";
import { serverEnv } from "~/env/server";
import { db } from "~/lib/db";

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "pg",
		// schema: schema,
		// debugLogs: true,
	}),
	plugins: [
		nextCookies(),
		admin(),
		apiKey({
			schema: {
				apikey: {
					fields: {},
					modelName: "apikeyModel",
				},
			},
			rateLimit: {
				enabled: true,
				maxRequests: 100,
				timeWindow: 60 * 1000, // 1 minute
			},
		}),
	],

	emailAndPassword: {
		enabled: true,
		autoSignIn: true,
		requireEmailVerification: true,
	},
	socialProviders: {
		github: {
			clientId: serverEnv.GITHUB_CLIENT_ID,
			clientSecret: serverEnv.GITHUB_CLIENT_SECRET,
		},
	},

	account: {
		modelName: "accountModel",
	},
	user: {
		modelName: "userModel",
		fields: {
			image: "avatar",
		},
	},
	session: {
		modelName: "sessionModel",
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // 5 minutes
		},
	},
	verification: {
		modelName: "verificationModel",
	},
	rateLimit: {
		enabled: true,
		modelName: "rateLimitModel",
	},
});
