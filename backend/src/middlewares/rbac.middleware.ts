import type { NextFunction, Request, Response } from "express";
import type { Permission } from "../rbac/permissions.js";
import safeReject from "../utils/safeReject.js";
import { checkPermission } from "../rbac/rbac.service.js";

export function requirePermission(permission: Permission) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const workspaceId = req.params.id!;

    if (!userId) {
      return safeReject(res, {
        message: "You do not have permission to perform this action.",
        status: 403,
        path: req.originalUrl,
        data: null,
      });
    }

    const allowed = await checkPermission({ userId, workspaceId, permission });
    if (!allowed) {
      return safeReject(res, {
        message: "You do not have permission to perform this action.",
        status: 403,
        path: req.originalUrl,
        data: null,
      });
    }
    next();
  };
}
