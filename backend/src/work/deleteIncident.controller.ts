import type { Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import safeResponse from "../utils/safeResponse.js";
import {
  getIncidentOwnerModel,
  softDeleteIncidentModel,
} from "./deleteWork.model.js";
import { canDeleteWork } from "./deleteWork.service.js";

async function deleteIncidentController(req: Request, res: Response) {
  try {
    const workspaceId = req.params.id;
    const incidentId = req.params.incidentId;
    const userId = req.user?.id;

    if (!userId || !workspaceId || !incidentId) {
      return safeReject(res, {
        message: "Unauthorized",
        path: req.originalUrl,
        status: 401,
      });
    }

    const incident = await getIncidentOwnerModel(incidentId);

    if (!incident) {
      return safeReject(res, {
        message: "Incident not found",
        path: req.originalUrl,
        status: 404,
      });
    }

    if (incident.workspace_id !== workspaceId) {
      return safeReject(res, {
        message: "Incident not found",
        path: req.originalUrl,
        status: 404,
      });
    }

    const allowed = await canDeleteWork({
      userId,
      workspaceId,
      createdBy: incident.created_by,
      teamId: incident.team_id,
    });

    if (!allowed) {
      return safeReject(res, {
        message: "You do not have permission to perform this action.",
        path: req.originalUrl,
        status: 403,
      });
    }

    const deleted = await softDeleteIncidentModel(incidentId);

    if (!deleted) {
      return safeReject(res, {
        message: "Something went wrong",
        path: req.originalUrl,
        status: 500,
      });
    }

    return safeResponse(res, {
      message: "Incident deleted successfully",
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

export default deleteIncidentController;
