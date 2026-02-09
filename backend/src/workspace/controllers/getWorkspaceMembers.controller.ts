import type { NextFunction, Request, Response } from "express";
import safeResponse from "../../utils/safeResponse.js";
import createHttpError from "http-errors";
import { getWorkspaceMembersService } from "../service/getWorkspaceMembers.service.js";
import type { ROLE } from "../../rbac/roles.js";

export async function getWorkspaceMembersController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const workspaceId = req.params.id;
    if (!workspaceId) {
      return next(createHttpError(404, "Workspace not found"));
    }

    const role = (req.query.role as ROLE) || null;
    const team = (req.query.team as string) || null;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const result = await getWorkspaceMembersService({
      workspaceId,
      role,
      team,
      page,
      limit,
    });

    return safeResponse(res, {
      path: req.originalUrl,
      status: 200,
      message: "Successfully fetched workspace members",
      data: result,
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500, "Something went wrong"));
  }
}
