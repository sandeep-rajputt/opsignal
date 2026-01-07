import dotenv from "dotenv";
dotenv.config();

const _config = {
  PORT: process.env.PORT || 3002,
  ENV: process.env.ENV || "production",
  POSTGRESQL_URI: process.env.POSTGRESQL_URI,
  REDIS_URL: process.env.REDIS_URL,
  FRONTEND_URL: process.env.FRONTEND_URL || "https://opsignal.sandeeprajput.in",
};

const config = Object.freeze(_config);
export default config;
