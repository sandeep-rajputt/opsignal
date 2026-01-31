import { existsSync } from "fs";
import dotenv from "dotenv";
import configSchema from "../schemas/configSchema.js";

dotenv.config();

const renderEnvPath = "/etc/secrets/.env.production";
if (existsSync(renderEnvPath)) {
  dotenv.config({ path: renderEnvPath, override: true });
}

const _config = {
  PORT: process.env.PORT || 3002,
  ENV: process.env.ENV || "production",
  POSTGRESQL_URI: process.env.POSTGRESQL_URI,
  REDIS_URL: process.env.REDIS_URL,
  FRONTEND_URL: process.env.FRONTEND_URL || "https://opsignal.sandeeprajput.in",
  BULL_REDIS_URL: process.env.BULL_REDIS_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  EMAIL_VERIFY_JWT_TOKEN: process.env.EMAIL_VERIFY_JWT_TOKEN,
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
};

const res = await configSchema.safeParseAsync(_config);

if (res.error) {
  console.error(res.error);
  throw new Error("Please add all required environment variables");
}

const config = Object.freeze(res.data);
export default config;
