import { vercel } from "@t3-oss/env-core/presets-zod";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnv = createEnv({
	isServer: typeof window === "undefined",
	server: {
		DATABASE_URL: z.string().refine((val) => {
			if (!val.startsWith("postgresql://"))
				throw new Error(
					"Invalid DATABASE_URL: must start with 'postgresql://'"
				);
			return true;
		}),
		// TURSO_DATABASE_URL: z.string().refine((val) => {
		//   if (!val.startsWith("libsql://")) throw new Error("Invalid TURSO_DATABASE_URL: must start with 'libsql://'");
		//   return true;
		// }),
		// TURSO_AUTH_TOKEN: z.string().jwt(),

		BETTER_AUTH_SECRET: z.string(),
		BETTER_AUTH_URL: z.string().url(),
		GITHUB_CLIENT_ID: z.string(),
		GITHUB_CLIENT_SECRET: z.string(),

		TURNSTILE_SECRET_KEY: z.string(),

		HEADER_SECRET: z.string(),
	},
	experimental__runtimeEnv: process.env,
	skipValidation: false,
	emptyStringAsUndefined: true,
	onValidationError(issues) {
		console.error(`❌ Invalid environment variables:`, issues);
		throw new Error("❌ Invalid environment variables");
	},
	onInvalidAccess(variable) {
		console.error(`❌ Invalid access to environment variable: ${variable}`);
		throw new Error(
			"❌ Attempted to access a server-only environment variable on the client side."
		);
	},
	extends: [vercel()],
});
