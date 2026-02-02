import type { NextFunction, Request, Response } from "express";
import { getUserPrimaryWorkspaceModel } from "../model/getUserPrimaryWorkspace.model.js";
import safeResponse from "../../utils/safeResponse.js";
import createHttpError from "http-errors";

export async function checkPrimaryWorkspaceService(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user?.id!;

  const workspaceId = await getUserPrimaryWorkspaceModel(userId);
  if (workspaceId) {
    return safeResponse(res, {
      status: 200,
      message: "Primary workspace exist",
      path: req.originalUrl,
      data: { id: workspaceId },
    });
  } else {
    return next(createHttpError(400, "Workspace not exist"));
  }
}
