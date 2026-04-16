import type { NextFunction, Request, Response } from "express";
import safeResponse from "../../utils/safeResponse.js";
import createHttpError from "http-errors";
import { addWorkspaceMemberService } from "../service/addWorkspaceMember.service.js";
import { addWorkspaceMemberSchema } from "../validation/addWorkspaceMember.validation.js";

/**
 * Controller for adding workspace members
 */
export async function addWorkspaceMemberController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const workspaceId = req.params.id;
    if (!workspaceId) {
      return next(createHttpError(404, "Workspace not found"));
    }

    const requestingUserId = req.user?.id;
    if (!requestingUserId) {
      return next(createHttpError(401, "Authentication required"));
    }

    // Validate request body
    const validationResult = addWorkspaceMemberSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.issues[0]?.message || "Invalid input";
      return next(createHttpError(400, errorMessage));
    }

    const { email, role, teamId } = validationResult.data;

    const result = await addWorkspaceMemberService({
      workspaceId,
      requestingUserId,
      email,
      role,
      teamId,
    });

    return safeResponse(res, {
      path: req.originalUrl,
      status: 201,
      message: result.message,
      data: result,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      // Handle specific error messages from service layer
      if (error.message.includes("permission")) {
        return next(createHttpError(403, error.message));
      }
      if (error.message.includes("does not exist")) {
        return next(createHttpError(404, error.message));
      }
      if (
        error.message.includes("already a member") ||
        error.message.includes("maximum workspace limit") ||
        error.message.includes("does not belong")
      ) {
        return next(createHttpError(400, error.message));
      }
    }
    next(createHttpError(500, "Something went wrong"));
  }
}
