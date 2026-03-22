import type { Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import safeResponse from "../utils/safeResponse.js";
import {
  getImprovementOwnerModel,
  softDeleteImprovementModel,
} from "./deleteWork.model.js";
import { canDeleteWork } from "./deleteWork.service.js";

async function deleteImprovementController(req: Request, res: Response) {
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

    const improvement = await getImprovementOwnerModel(improvementId);

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

    const allowed = await canDeleteWork({
      userId,
      workspaceId,
      createdBy: improvement.created_by,
      teamId: improvement.team_id,
    });

    if (!allowed) {
      return safeReject(res, {
        message: "You do not have permission to perform this action.",
        path: req.originalUrl,
        status: 403,
      });
    }

    const deleted = await softDeleteImprovementModel(improvementId);

    if (!deleted) {
      return safeReject(res, {
        message: "Something went wrong",
        path: req.originalUrl,
        status: 500,
      });
    }

    return safeResponse(res, {
      message: "Improvement deleted successfully",
      path: req.originalUrl,
      status: 200,
      data: null,
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

export default deleteImprovementController;
