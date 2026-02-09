import type { NextFunction, Request, Response } from "express";
import safeResponse from "../../utils/safeResponse.js";
import { getUserRole } from "../../rbac/rbac.service.js";
import safeReject from "../../utils/safeReject.js";
import createHttpError from "http-errors";

export async function getUserRoleController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const workspaceId = req.params.id;
    if (!workspaceId) {
      return next(createHttpError(404, "Workspace not found"));
    }
    const role = await getUserRole(req.user?.id!, workspaceId);
    if (!role) {
      return next(
        createHttpError(403, "User have no permission in this workspace"),
      );
    }
    return safeResponse(res, {
      path: req.originalUrl,
      status: 200,
      message: role,
      data: null,
    });
  } catch (error) {
    next(createHttpError(500, "Something went wrong"));
  }
}
