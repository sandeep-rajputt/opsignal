import type { NextFunction, Request, Response } from "express";
import { createWorkspaceService } from "../service/createWorkspace.service.js";
import safeReject from "../../utils/safeReject.js";
import redisClient from "../../config/redis.js";

async function createWorkspaceController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await redisClient.del(`user:${req.user?.id}:allworkspaces`);
    return await createWorkspaceService(req, res, next);
  } catch (error) {
    console.log(error);
    return safeReject(res, {
      path: req.originalUrl,
      message: "Something went wrong",
      status: 500,
    });
  }
}

export default createWorkspaceController;
