import type { NextFunction, Request, Response } from "express";
import safeResponse from "../../utils/safeResponse.js";
import createHttpError from "http-errors";
import { getWorkspaceBasicInfoService } from "../service/getWorkspaceBasicInfo.service.js";

export async function getWorkspaceBasicInfoController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const workspaceId = req.params.id;
    const userId = req.user?.id;

    if (!workspaceId) {
      return next(createHttpError(404, "Workspace not found"));
    }

    if (!userId) {
      return next(createHttpError(401, "Unauthorized"));
    }

    const workspace = await getWorkspaceBasicInfoService(workspaceId, userId);

    if (!workspace) {
      return next(createHttpError(404, "Workspace not found"));
    }

    return safeResponse(res, {
      path: req.originalUrl,
      status: 200,
      message: "Successfully fetched workspace info",
      data: workspace,
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Something went wrong"));
  }
}
