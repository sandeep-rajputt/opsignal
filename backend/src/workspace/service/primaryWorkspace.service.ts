import type { NextFunction, Request, Response } from "express";
import { getUserPrimaryWorkspaceModel } from "../model/getUserPrimaryWorkspace.model.js";
import safeResponse from "../../utils/safeResponse.js";
import onboardingSchema from "../validation/onboardingSchema.js";
import createHttpError from "http-errors";
import { onboardingModel } from "../model/onboarding.model.js";

export async function primaryWorkspaceService(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const primaryWorkspace = await getUserPrimaryWorkspaceModel(req.user?.id!);
  if (primaryWorkspace) {
    return safeResponse(res, {
      status: 200,
      message: "Already have primary workspace",
      path: req.originalUrl,
      data: { id: primaryWorkspace },
    });
  }

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

  const primaryWorkspaceId = await onboardingModel({
    data: resData.data,
    userId: req.user?.id!,
  });

  if (!primaryWorkspaceId) {
    return next(createHttpError(500, "Something went wrong"));
  }

  return safeResponse(res, {
    status: 201,
    message: "Workspace created successfully",
    path: req.originalUrl,
    data: { id: primaryWorkspaceId },
  });
}
