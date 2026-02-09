import type { NextFunction, Request, Response } from "express";
import { primaryWorkspaceService } from "../service/primaryWorkspace.service.js";
import safeReject from "../../utils/safeReject.js";
import { checkPrimaryWorkspaceService } from "../service/checkPrimaryWorkspace.service.js";
import redisClient from "../../config/redis.js";

async function primaryWorkspaceController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await redisClient.del(`user:${req.user?.id}`);
    return await primaryWorkspaceService(req, res, next);
  } catch (error) {
    console.log(error);
    return safeReject(res, {
      path: req.originalUrl,
      message: "Something went wrong",
      status: 500,
    });
  }
}

export async function checkPrimaryWorkspaceController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    return await checkPrimaryWorkspaceService(req, res, next);
  } catch (error) {
    console.log(error);
    return safeReject(res, {
      path: req.originalUrl,
      message: "Something went wrong",
      status: 500,
    });
  }
}

export default primaryWorkspaceController;
