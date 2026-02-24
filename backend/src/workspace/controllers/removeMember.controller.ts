import type { NextFunction, Request, Response } from "express";
import safeResponse from "../../utils/safeResponse.js";
import createHttpError from "http-errors";
import { removeMemberService } from "../service/removeMember.service.js";

/**
 * Controller for removing workspace members with role-based permissions
 * Validates removal permissions based on role hierarchy
 */
export async function removeMemberController(
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

    const result = await removeMemberService({
      workspaceId,
      requestingUserId,
      targetMemberId: memberId,
    });

    return safeResponse(res, {
      path: req.originalUrl,
      status: 200,
      message: "Member removed successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      // Handle specific error messages from service layer
      if (
        error.message.includes("permission") ||
        error.message.includes("Cannot remove")
      ) {
        return next(createHttpError(403, error.message));
      }
      if (error.message.includes("not found")) {
        return next(createHttpError(404, error.message));
      }
    }
    next(createHttpError(500, "Something went wrong"));
  }
}
