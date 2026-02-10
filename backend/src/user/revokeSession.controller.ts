import type { NextFunction, Request, Response } from "express";
import safeResponse from "../utils/safeResponse.js";
import { revokeSessionService } from "./revokeSession.service.js";
import createHttpError from "http-errors";

export async function revokeSessionController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;
    const sessionId = req.params.sessionId;

    if (!userId) {
      return next(createHttpError(401, "Unauthorized"));
    }

    if (!sessionId) {
      return next(createHttpError(400, "Session ID is required"));
    }

    const result = await revokeSessionService(sessionId, userId);

    if (!result) {
      return next(createHttpError(404, "Session not found or already revoked"));
    }

    return safeResponse(res, {
      path: req.originalUrl,
      status: 200,
      message: "Session revoked successfully",
      data: null,
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Something went wrong"));
  }
}
