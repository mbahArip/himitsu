import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { serverEnv } from "~/env/server";
import * as schema from "~/model";

const pool = new Pool({
	connectionString: serverEnv.DATABASE_URL,
});

export const db = drizzle({
	client: pool,
	schema,
});
