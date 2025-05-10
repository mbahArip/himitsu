import { createSafeActionClient } from "next-safe-action";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "~/lib/auth";
import { db } from "~/lib/db";

export const actionClient = createSafeActionClient({
  defineMetadataSchema() {
    return z.object({
      path: z.string(),
      name: z.string(),
    });
  },
  handleServerError(e, { metadata }) {
    console.error(`[SafeActionError](${metadata.path}|${metadata.name}) ${e.name}: ${e.message}`);
    return "Uh oh! Something went wrong while executing the action. Please try again later.";
  },
});

export const protectedActionClient = actionClient.use(async ({ next, ctx, ...rest }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }

  return next({
    ctx: {
      ...ctx,
      session,
      db,
    },
    ...rest,
  });
});
