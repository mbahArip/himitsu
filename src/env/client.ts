import { vercel } from "@t3-oss/env-core/presets-zod";
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const clientEnv = createEnv({
  isServer: typeof window === "undefined",
  client: {
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().min(1, "Captcha site key is required"),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  },
  skipValidation: false,
  emptyStringAsUndefined: true,
  onValidationError(issues) {
    console.error(`❌ Invalid environment variables:`, issues);
    throw new Error("❌ Invalid environment variables");
  },
  extends: [vercel()],
});
