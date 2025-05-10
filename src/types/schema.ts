import { z } from "zod";

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
