import type { NextFunction, Request, Response } from "express";
import safeResponse from "../../utils/safeResponse.js";
import createHttpError from "http-errors";
import { updateMemberRoleService } from "../service/updateMemberRole.service.js";
import { updateMemberRoleSchema } from "../validation/updateMemberRole.validation.js";

/**
 * Controller for updating workspace member roles with role-based permissions
 * Validates role change permissions based on role hierarchy
 */
export async function updateMemberRoleController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const workspaceId = req.params.id;
    if (!workspaceId) {
      return next(createHttpError(404, "Workspace not found"));
    }

    const memberId = req.params.memberId;
    if (!memberId) {
      return next(createHttpError(400, "Member ID is required"));
    }

    const requestingUserId = req.user?.id;
    if (!requestingUserId) {
      return next(createHttpError(401, "Authentication required"));
    }

    // Validate request body
    const validationResult = updateMemberRoleSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.issues[0]?.message || "Invalid input";
      return next(createHttpError(400, errorMessage));
    }

    const { role: newRole } = validationResult.data;

    const result = await updateMemberRoleService({
      workspaceId,
      requestingUserId,
      targetMemberId: memberId,
      newRole,
    });

    return safeResponse(res, {
      path: req.originalUrl,
      status: 200,
      message: "Member role updated successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      // Handle specific error messages from service layer
      if (
        error.message.includes("permission") ||
        error.message.includes("Cannot")
      ) {
        return next(createHttpError(403, error.message));
      }
      if (error.message.includes("not found")) {
        return next(createHttpError(404, error.message));
      }
      if (error.message.includes("already has")) {
        return next(createHttpError(400, error.message));
      }
    }
    next(createHttpError(500, "Something went wrong"));
  }
}
