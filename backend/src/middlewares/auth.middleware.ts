import type { NextFunction, Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import { verifyToken } from "../utils/jwt.js";
import config from "../config/config.js";
import refreshAccessToken from "../utils/refreshAccessToken.js";

async function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = req.cookies.access_token;

    if (!accessToken) {
      return await checkRefreshToken(req, res, next);
    }

    const result = verifyToken({
      token: accessToken,
      secret: config.ACCESS_TOKEN_SECRET,
    });

    if (!result.success) {
      return await checkRefreshToken(req, res, next);
    }

    const { id } = result.data;
    req.user = { id: String(id) };
    return next();
  } catch (error) {
    return safeReject(res, {
      message: "Something Went wrong",
      path: req.originalUrl,
      status: 500,
    });
  }
}

async function checkRefreshToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    res.clearCookie("access_token").clearCookie("refresh_token");
    return safeReject(res, {
      message: "Unauthorized",
      path: req.originalUrl,
      status: 401,
    });
  }

  try {
    const refreshResult = await refreshAccessToken({
      res,
      refreshToken,
    });

    if (!refreshResult.success || !refreshResult.userId) {
      res.clearCookie("access_token").clearCookie("refresh_token");
      return safeReject(res, {
        message: "Unauthorized",
        path: req.originalUrl,
        status: 401,
      });
    }

    // Use the userId returned from refreshAccessToken
    req.user = { id: refreshResult.userId };
    return next();
  } catch (error) {
    return safeReject(res, {
      message: "Something went wrong during token refresh",
      path: req.originalUrl,
      status: 500,
    });
  }
}

export default authMiddleware;
