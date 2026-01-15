import dotenv from "dotenv";
import configSchema from "../schemas/configSchema.js";
dotenv.config();

const _config = {
  PORT: process.env.PORT || 3002,
  ENV: process.env.ENV || "production",
  POSTGRESQL_URI: process.env.POSTGRESQL_URI,
  REDIS_URL: process.env.REDIS_URL,
  FRONTEND_URL: process.env.FRONTEND_URL || "https://opsignal.sandeeprajput.in",
  BULL_REDIS_URL: process.env.BULL_REDIS_URL,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
};

const res = await configSchema.safeParseAsync(_config);
if (res.error) {
  throw new Error("Please add all required enviroment veriables");
}

const config = Object.freeze(res.data);
export default config;
