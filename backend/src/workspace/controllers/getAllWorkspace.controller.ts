import type { NextFunction, Request, Response } from "express";
import { getAllWorkspaceService } from "../service/workspace.controller.js";
import safeResponse from "../../utils/safeResponse.js";
import createHttpError from "http-errors";
import redisClient from "../../config/redis.js";

async function getAllWorkspaceController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const redisData = await redisClient.get(
      `user:${req.user?.id}:allworkspaces`,
    );
    if (redisData) {
      return safeResponse(res, {
        path: req.originalUrl,
        status: 200,
        message: "Successfully fetched workspaces",
        data: JSON.parse(redisData),
      });
    }
    const data = await getAllWorkspaceService(req.user?.id!);

    await redisClient.set(
      `user:${req.user?.id}:allworkspaces`,
      JSON.stringify(data),
      "EX",
      5 * 60,
    );

    return safeResponse(res, {
      path: req.originalUrl,
      status: 200,
      message: "Successfully fetched workspaces",
      data,
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500));
  }
}

export default getAllWorkspaceController;
