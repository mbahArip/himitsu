"use server";

import { serverEnv } from "~/env/server";
import { actionClient } from "~/lib/safe-action";
import { TurnstileErrorCodes, type ITurnstileResponse } from "~/types/captcha";
import { TurnstileCaptchaSchema } from "~/types/schema";

export const validateCaptchaAction = actionClient
  .metadata({
    name: "validateCaptcha",
    path: "captcha.validateCaptcha",
  })
  .schema(TurnstileCaptchaSchema)
  .action(async (data) => {
    const { "cf-turnstile": token } = data.parsedInput;

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: `secret=${encodeURIComponent(serverEnv.TURNSTILE_SECRET_KEY)}&response=${encodeURIComponent(token)}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    const json = (await response.json()) as ITurnstileResponse;
    if (!json.success) {
      // Only return the first error code
      const message = TurnstileErrorCodes[json["error-codes"][0]];
      throw new Error(`Failed to validate captcha: ${message}`);
    }

    return {
      success: true,
    };
  });
