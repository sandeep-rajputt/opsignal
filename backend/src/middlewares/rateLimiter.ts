import redisClient from "../config/redis.js";
import type { Request, Response, NextFunction } from "express";
import safeReject from "../utils/safeReject.js";

type RateLimiter = {
  path: string;
  maxRequests: number;
  timeInSeconds: number;
};

function rateLimiter({ path, maxRequests, timeInSeconds }: RateLimiter) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const userIp = req.ip || "unknown";

      const identifier = userId || userIp;
      const keyType = userId ? "user" : "ip";
      const key = `rate_limit:${path}:${keyType}:${identifier}`;

      const now = Date.now();
      const startTime = now - timeInSeconds * 1000;

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

export default rateLimiter;
