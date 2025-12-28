import dotenv from "dotenv";
dotenv.config();

const _config = {
  PORT: process.env.PORT || 3002,
  ENV: process.env.ENV || "production",
};

const config = Object.freeze(_config);
export default config;
