import dotenv from "dotenv";
dotenv.config();

const _config = {
  PORT: process.env.PORT || 3002,
  ENV: process.env.ENV || "production",
  POSTGRESQL_URI: process.env.POSTGRESQL_URI,
};

const config = Object.freeze(_config);
export default config;
