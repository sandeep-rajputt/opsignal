import type { Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import safeResponse from "../utils/safeResponse.js";
import { changeImprovementCategoryValidation } from "./changeImprovementCategory.validation.js";
import {
  getImprovementForCategoryChangeModel,
  changeImprovementCategoryModel,
} from "./changeImprovementCategory.model.js";
import { canChangeImprovementCategory } from "./changeImprovementCategory.service.js";

async function changeImprovementCategoryController(
  req: Request,
  res: Response,
) {
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

    const resData = await changeImprovementCategoryValidation.safeParseAsync(
      req.body,
    );

    if (!resData.success) {
      return safeReject(res, {
        message: "Invalid input",
        path: req.originalUrl,
        status: 400,
      });
    }

    const { category } = resData.data;

    const improvement =
      await getImprovementForCategoryChangeModel(improvementId);

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

    if (improvement.category === category) {
      return safeReject(res, {
        message: "Improvement already has this category",
        path: req.originalUrl,
        status: 400,
      });
    }

    const allowed = await canChangeImprovementCategory({
      userId,
      workspaceId,
      scope: improvement.scope,
      teamId: improvement.team_id,
      createdBy: improvement.created_by,
    });

    if (!allowed) {
      return safeReject(res, {
        message: "You do not have permission to perform this action.",
        path: req.originalUrl,
        status: 403,
      });
    }

    const updated = await changeImprovementCategoryModel({
      improvementId,
      category,
      actorId: userId,
      workspaceId,
      fromCategory: improvement.category,
    });

    if (!updated) {
      return safeReject(res, {
        message: "Something went wrong",
        path: req.originalUrl,
        status: 500,
      });
    }

    return safeResponse(res, {
      message: "Improvement category updated successfully",
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

export default changeImprovementCategoryController;
