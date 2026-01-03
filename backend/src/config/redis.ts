import { Redis } from "ioredis";
import config from "./config.js";

if (!config.REDIS_URL) {
  throw new Error(`REDIS_URL is required`);
}

const redisClient = new Redis(config.REDIS_URL);

export default redisClient;
