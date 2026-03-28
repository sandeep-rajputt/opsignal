import type { Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import safeResponse from "../utils/safeResponse.js";
import {
  getImprovementForLogsModel,
  getImprovementLogsModel,
  checkUserCanViewImprovementLogs,
} from "./getImprovementLogs.model.js";
import { transformImprovementLogsToWorkLogs } from "./getImprovementLogs.service.js";

async function getImprovementLogsController(req: Request, res: Response) {
  try {
    const workspaceId = req.params.id;
    const improvementId = req.params.improvementId;
    const userId = req.user?.id;

    if (!userId || !workspaceId || !improvementId) {
      return safeReject(res, {
        message: "Unauthorized",
        path: req.originalUrl,
        status: 401,
      });
    }

    const improvement = await getImprovementForLogsModel(improvementId);

    if (!improvement) {
      return safeReject(res, {
        message: "Improvement not found",
        path: req.originalUrl,
        status: 404,
      });
    }

    if (improvement.workspace_id !== workspaceId) {
      return safeReject(res, {
        message: "Improvement not found",
        path: req.originalUrl,
        status: 404,
      });
    }

    const canView = await checkUserCanViewImprovementLogs({
      userId,
      workspaceId,
      teamId: improvement.team_id,
      scope: improvement.scope,
    });

    if (!canView) {
      return safeReject(res, {
        message: "You do not have permission to perform this action.",
        path: req.originalUrl,
        status: 403,
      });
    }

    const logs = await getImprovementLogsModel(improvementId);

    const workLogs = transformImprovementLogsToWorkLogs(logs);

    return safeResponse(res, {
      message: "Improvement logs fetched successfully",
      path: req.originalUrl,
      status: 200,
      data: workLogs,
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

export default getImprovementLogsController;
