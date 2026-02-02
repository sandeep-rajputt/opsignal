import type { Response } from "express";
import config from "../config/config.js";
import { query } from "../config/db.js";
import { createToken, verifyToken } from "./jwt.js";
import addRefreshToken from "./addRefreshToken.js";
import addAccessToken from "./addAccessToken.js";
import redisClient from "../config/redis.js";

type RefreshTokenResult =
  | { success: true; userId: string }
  | { success: false; error: unknown };

async function refreshAccessToken({
  res,
  refreshToken,
}: {
  res: Response;
  refreshToken: string;
}): Promise<RefreshTokenResult> {
  try {
    const jwtRes = verifyToken({
      token: refreshToken,
      secret: config.REFRESH_TOKEN_SECRET,
    });

    if (jwtRes.success) {
      const { id, sessionId } = jwtRes.data;
      if (await redisClient.get(`user:accesstoken:${sessionId}`)) {
        return { success: true, userId: String(id) };
      }
      const newRefreshToken = createToken({
        key: config.REFRESH_TOKEN_SECRET,
        data: { id, sessionId },
        expiresIn: "7d",
      });
      const newAccessToken = createToken({
        key: config.ACCESS_TOKEN_SECRET,
        data: { id },
        expiresIn: "15m",
      });

      addRefreshToken({ res, token: newRefreshToken, id: null });
      addAccessToken({ res, token: newAccessToken, id: null });

      const dbResult = await updateRefreshTokenInDb(newRefreshToken);

      await redisClient.set(`user:accesstoken:${sessionId}`, "1", "EX", 120);

      if (dbResult.success) {
        return { success: true, userId: String(id) };
      } else {
        return { success: false, error: dbResult.error };
      }
    } else {
      return { success: false, error: jwtRes.error };
    }
  } catch (error) {
    return { success: false, error };
  }
}

export async function updateRefreshTokenInDb(token: string) {
  try {
    const jwtRes = verifyToken({ token, secret: config.REFRESH_TOKEN_SECRET });
    if (jwtRes.success) {
      const { sessionId } = jwtRes.data;
      await query(
        `
        UPDATE sessions
        SET refresh_token = $1, updated_at = NOW(), expires_at = NOW() + INTERVAL '7 days'
        WHERE id = $2
        `,
        [token, sessionId],
      );
      return { success: true };
    } else {
      return { success: false, error: jwtRes.error };
    }
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
}

export default refreshAccessToken;
