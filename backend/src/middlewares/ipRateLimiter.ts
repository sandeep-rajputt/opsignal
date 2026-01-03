import redisClient from "../config/redis.js";
import type { Request, Response, NextFunction } from "express";
import safeReject from "../utils/safeReject.js";

type RateLimiter = {
  path: string;
  maxRequests: number;
  timeInMilliseconds: number;
};

function ipRateLimiter({ path, maxRequests, timeInMilliseconds }: RateLimiter) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userIp = req.ip || "unknown";
      const key = `rate_limit:${path}:ip:${userIp}`;

      const now = Date.now();
      const startTime = now - timeInMilliseconds;

      await redisClient.zremrangebyscore(key, 0, startTime);

      const requests = await redisClient.zcard(key);

      if (requests >= maxRequests) {
        const lastItem = await redisClient.zrange(key, 0, 0);
        const ttl = Number(lastItem[0]) - startTime;
        return safeReject(res, {
          status: 429,
          path: req.originalUrl,
          message: "Too many request",
          data: ttl,
        });
      }
      await redisClient.zadd(key, now, now);
      next();
    } catch {
      next();
    }
  };
}

export default ipRateLimiter;
