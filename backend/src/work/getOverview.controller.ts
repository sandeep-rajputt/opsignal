import type { Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import safeResponse from "../utils/safeResponse.js";
import {
  checkUserWorkspaceMembership,
  getUserRoleInWorkspace,
  getOverviewModel,
} from "./getOverview.model.js";
import { transformOverviewData } from "./getOverview.service.js";

async function getOverviewController(req: Request, res: Response) {
  try {
    const workspaceId = req.params.id;
    const userId = req.user?.id;

    if (!userId || !workspaceId) {
      return safeReject(res, {
        message: "Unauthorized",
        path: req.originalUrl,
        status: 401,
      });
    }

    const isMember = await checkUserWorkspaceMembership({
      userId,
      workspaceId,
    });

    if (!isMember) {
      return safeReject(res, {
        message: "You do not have permission to perform this action.",
        path: req.originalUrl,
        status: 403,
      });
    }

    const userRole = await getUserRoleInWorkspace({ userId, workspaceId });

    if (!userRole) {
      return safeReject(res, {
        message: "You do not have permission to perform this action.",
        path: req.originalUrl,
        status: 403,
      });
    }

    const overview = await getOverviewModel({
      workspaceId,
      teamId: userRole.team_id,
    });

    const transformedData = transformOverviewData(overview);

    return safeResponse(res, {
      message: "Overview fetched successfully",
      path: req.originalUrl,
      status: 200,
      data: transformedData,
    });
  } catch (error) {
    console.log(error);
    return safeReject(res, {
      message: "Something went wrong",
      path: req.originalUrl,
      status: 500,
    });
  }
}

export default getOverviewController;
