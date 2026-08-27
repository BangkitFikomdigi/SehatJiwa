import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Pool koneksi ke Postgres local. Di dev cukup satu instance yang dipakai
// ulang lintas hot-reload supaya tidak buka koneksi baru terus-menerus.
declare global {
  // eslint-disable-next-line no-var
  var _pgPool: Pool | undefined;
}

const pool =
  global._pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
  });

if (process.env.NODE_ENV !== "production") {
  global._pgPool = pool;
}

export const db = drizzle(pool, { schema });
