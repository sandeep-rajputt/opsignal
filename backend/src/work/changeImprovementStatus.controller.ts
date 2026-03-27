import type { Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import safeResponse from "../utils/safeResponse.js";
import { changeImprovementStatusValidation } from "./changeImprovementStatus.validation.js";
import {
  getImprovementForStatusChangeModel,
  changeImprovementStatusModel,
} from "./changeImprovementStatus.model.js";
import { canChangeImprovementStatus } from "./changeImprovementStatus.service.js";

async function changeImprovementStatusController(req: Request, res: Response) {
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

    const resData = await changeImprovementStatusValidation.safeParseAsync(
      req.body,
    );

    if (!resData.success) {
      return safeReject(res, {
        message: "Invalid input",
        path: req.originalUrl,
        status: 400,
      });
    }

    const { status } = resData.data;

    const improvement = await getImprovementForStatusChangeModel(improvementId);

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

    if (improvement.status === status) {
      return safeReject(res, {
        message: "Improvement already has this status",
        path: req.originalUrl,
        status: 400,
      });
    }

    const allowed = await canChangeImprovementStatus({
      userId,
      workspaceId,
      scope: improvement.scope,
      teamId: improvement.team_id,
    });

    if (!allowed) {
      return safeReject(res, {
        message: "You do not have permission to perform this action.",
        path: req.originalUrl,
        status: 403,
      });
    }

    const updated = await changeImprovementStatusModel({
      improvementId,
      status,
      actorId: userId,
      workspaceId,
      fromStatus: improvement.status,
    });

    if (!updated) {
      return safeReject(res, {
        message: "Something went wrong",
        path: req.originalUrl,
        status: 500,
      });
    }

    return safeResponse(res, {
      message: "Improvement status updated successfully",
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

export default changeImprovementStatusController;
