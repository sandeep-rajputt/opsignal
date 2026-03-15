import type { Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import safeResponse from "../utils/safeResponse.js";
import { createImprovementValidation } from "./work.validation.js";
import { resolveWorkScope } from "./work.service.js";
import { createImprovementModel } from "./work.model.js";

async function createImprovementController(req: Request, res: Response) {
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

    const resData = await createImprovementValidation.safeParseAsync(req.body);

    if (!resData.success) {
      return safeReject(res, {
        message: "Invalid input",
        path: req.originalUrl,
        status: 400,
      });
    }

    const { title, category, teamId, description, expectedImpact } =
      resData.data;

    const scope = await resolveWorkScope({
      userId,
      workspaceId,
      requestedTeamId: teamId,
    });

    if (!scope) {
      return safeReject(res, {
        message: "You do not have permission to perform this action.",
        path: req.originalUrl,
        status: 403,
      });
    }

    const id = await createImprovementModel({
      workspaceId,
      teamId: scope.teamId,
      scope: scope.scope,
      createdBy: userId,
      title,
      category,
      ...(description && { description }),
      ...(expectedImpact && { expectedImpact }),
    });

    if (!id) {
      return safeReject(res, {
        message: "Something went wrong",
        path: req.originalUrl,
        status: 500,
      });
    }

    return safeResponse(res, {
      message: "Improvement created successfully",
      path: req.originalUrl,
      status: 201,
      data: { id },
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

export default createImprovementController;
