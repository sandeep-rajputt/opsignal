import { Pool } from "pg";
import config from "./config.js";

if (!config.POSTGRESQL_URI) {
  throw new Error("DATABASE_URL is missing in .env");
}

export const pool = new Pool({
  connectionString: config.POSTGRESQL_URI,
  max: 10,
  idleTimeoutMillis: 30000,
});

export async function query<T = any>(
  text: string,
  params?: any[],
): Promise<T[]> {
  // start timer
  const start = performance.now();

  const result = await pool.query(text, params);

  // end timer
  const end = performance.now();

  // log only in non-production
  if (config.ENV !== "production") {
    const time = (end - start).toFixed(2);
    console.log(`🗄️ PostgreSQL Query (${time} ms)`);
    console.log(`📄 SQL: ${text}`);
  }

  return result.rows as T[];
}
