import { Pool } from "pg";
import config from "./config.js";

if (!config.POSTGRESQL_URI) {
  throw new Error("DATABASE_URL is missing in .env");
}

const pool = new Pool({
  connectionString: config.POSTGRESQL_URI,
  max: 10,
  idleTimeoutMillis: 30000,
});

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const result = await pool.query(text, params);

  return result.rows as T[];
}
