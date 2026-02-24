import type { NextFunction, Request, Response } from "express";
import safeResponse from "../../utils/safeResponse.js";
import createHttpError from "http-errors";
import { getMembersService } from "../service/getMembers.service.js";

/**
 * Controller for getting workspace members with role-based visibility
 * Owners/Admins see all members, Moderators/Members see only their team members
 */
export async function getMembersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const workspaceId = req.params.id;
    if (!workspaceId) {
      return next(createHttpError(404, "Workspace not found"));
    }

    const userId = req.user?.id;
    if (!userId) {
      return next(createHttpError(401, "Authentication required"));
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getMembersService({
      workspaceId,
      userId,
      page,
      limit,
    });

    return safeResponse(res, {
      path: req.originalUrl,
      status: 200,
      message: "Successfully fetched members",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Something went wrong"));
  }
}
