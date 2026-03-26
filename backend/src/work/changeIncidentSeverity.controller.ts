import type { Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import safeResponse from "../utils/safeResponse.js";
import { changeIncidentSeverityValidation } from "./changeIncidentSeverity.validation.js";
import {
  getIncidentForSeverityChangeModel,
  changeIncidentSeverityModel,
} from "./changeIncidentSeverity.model.js";
import { canChangeIncidentSeverity } from "./changeIncidentSeverity.service.js";

async function changeIncidentSeverityController(req: Request, res: Response) {
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

    const resData = await changeIncidentSeverityValidation.safeParseAsync(
      req.body,
    );

    if (!resData.success) {
      return safeReject(res, {
        message: "Invalid input",
        path: req.originalUrl,
        status: 400,
      });
    }

    const { severity } = resData.data;

    const incident = await getIncidentForSeverityChangeModel(incidentId);

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

    if (incident.severity === severity) {
      return safeReject(res, {
        message: "Incident already has this severity",
        path: req.originalUrl,
        status: 400,
      });
    }

    const allowed = await canChangeIncidentSeverity({
      userId,
      workspaceId,
      scope: incident.scope,
      teamId: incident.team_id,
      createdBy: incident.created_by,
    });

    if (!allowed) {
      return safeReject(res, {
        message: "You do not have permission to perform this action.",
        path: req.originalUrl,
        status: 403,
      });
    }

    const updated = await changeIncidentSeverityModel({
      incidentId,
      severity,
      actorId: userId,
      workspaceId,
      fromSeverity: incident.severity,
    });

    if (!updated) {
      return safeReject(res, {
        message: "Something went wrong",
        path: req.originalUrl,
        status: 500,
      });
    }

    return safeResponse(res, {
      message: "Incident severity updated successfully",
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

export default changeIncidentSeverityController;
