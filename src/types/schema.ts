import { z } from "zod";
import type { environmentModel, folderModel } from "~/model";

export const TurnstileCaptchaSchema = z.object({
	"cf-turnstile": z.string().min(1, "Captcha is required"),
});
export const LoginSchema = z
	.object({
		email: z.string().email("Does not look like a valid email"),
		password: z
			.string()
			.min(8, "Password must be at least 8 characters long"),
		remember: z.boolean(),
	})
	.extend({
		"cf-turnstile": TurnstileCaptchaSchema.shape["cf-turnstile"],
	});

export const EnvironmentSchema = z.object({
	key: z.string().min(1, "Key is required"),
	label: z.string().min(1, "Label is required"),
	description: z.string().optional(),
	encryptedValue: z.string().min(1, "Encrypted value is required"),
});

export const GetEnvironmentsInputSchema = z.object({
	query: z.string().optional(),
});
export type GetEnvironmentsOutputSchema = {
	folders: (Pick<
		typeof folderModel.$inferSelect,
		"id" | "name" | "color" | "createdAt" | "updatedAt"
	> & {
		envs: Pick<
			typeof environmentModel.$inferSelect,
			"id" | "name" | "description" | "createdAt" | "updatedAt"
		>[];
	})[];
	files: Pick<
		typeof environmentModel.$inferSelect,
		"id" | "name" | "description" | "createdAt" | "updatedAt"
	>[];
};