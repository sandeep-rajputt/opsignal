import type { Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import safeResponse from "../utils/safeResponse.js";
import {
  getImprovementByIdModel,
  checkUserCanViewImprovement,
} from "./getImprovement.model.js";

async function getImprovementController(req: Request, res: Response) {
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

    const improvement = await getImprovementByIdModel(improvementId);

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

    const canView = await checkUserCanViewImprovement({
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

    return safeResponse(res, {
      message: "Improvement fetched successfully",
      path: req.originalUrl,
      status: 200,
      data: {
        id: improvement.id,
        title: improvement.title,
        status: improvement.status,
        category: improvement.category,
        description: improvement.description,
        expectedImpact: improvement.expected_impact,
        scope: improvement.scope,
        workspace: {
          id: improvement.workspace_id,
          name: improvement.workspace_name,
        },
        team: improvement.team_id
          ? { id: improvement.team_id, name: improvement.team_name }
          : null,
        createdBy: improvement.created_by_name,
        createdById: improvement.created_by_id,
        createdAt: improvement.created_at,
        updatedAt: improvement.updated_at,
      },
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

export default getImprovementController;
