import type { NextFunction, Request, Response } from "express";
import safeResponse from "../../utils/safeResponse.js";
import onboardingSchema from "../validation/onboardingSchema.js";
import createHttpError from "http-errors";
import { createWorkspaceModel } from "../model/createWorkspace.model.js";

export async function createWorkspaceService(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { workspaceName, workspaceDescription, teamName, timezone, plan } =
    req.body;

  const resData = await onboardingSchema.safeParseAsync({
    workspaceName,
    workspaceDescription,
    teamName,
    timezone,
    plan,
  });

  if (!resData.success) {
    return next(createHttpError(400, "Invalid input data"));
  }

  const workspaceId = await createWorkspaceModel({
    data: resData.data,
    userId: req.user?.id!,
  });

  if (!workspaceId) {
    return next(createHttpError(500, "Something went wrong"));
  }

  return safeResponse(res, {
    status: 201,
    message: "Workspace created successfully",
    path: req.originalUrl,
    data: { id: workspaceId },
  });
}
