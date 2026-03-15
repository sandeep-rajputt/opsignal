import type { Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import safeResponse from "../utils/safeResponse.js";
import { createIncidentValidation } from "./work.validation.js";
import { resolveWorkScope } from "./work.service.js";
import { createIncidentModel } from "./work.model.js";

async function createIncidentController(req: Request, res: Response) {
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

    const resData = await createIncidentValidation.safeParseAsync(req.body);

    if (!resData.success) {
      return safeReject(res, {
        message: "Invalid input",
        path: req.originalUrl,
        status: 400,
      });
    }

    const { title, severity, teamId, description } = resData.data;

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

    const id = await createIncidentModel({
      workspaceId,
      teamId: scope.teamId,
      scope: scope.scope,
      createdBy: userId,
      title,
      severity,
      ...(description && { description }),
    });

    if (!id) {
      return safeReject(res, {
        message: "Something went wrong",
        path: req.originalUrl,
        status: 500,
      });
    }

    return safeResponse(res, {
      message: "Incident created successfully",
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

export default createIncidentController;
