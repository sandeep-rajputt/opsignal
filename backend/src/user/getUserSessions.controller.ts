import type { NextFunction, Request, Response } from "express";
import safeResponse from "../utils/safeResponse.js";
import safeReject from "../utils/safeReject.js";
import { getUserSessionsService } from "./getUserSessions.service.js";

export async function getUserSessionsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Unauthorized",
        status: 401,
      });
    }

    const sessions = await getUserSessionsService(userId);

    return safeResponse(res, {
      path: req.originalUrl,
      status: 200,
      message: "Sessions fetched successfully",
      data: sessions,
    });
  } catch (error) {
    console.log(error);
    return safeReject(res, {
      path: req.originalUrl,
      message: "Something went wrong",
      status: 500,
    });
  }
}
