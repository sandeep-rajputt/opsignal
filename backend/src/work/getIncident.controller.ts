import type { Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import safeResponse from "../utils/safeResponse.js";
import {
  getIncidentByIdModel,
  checkUserCanViewIncident,
} from "./getIncident.model.js";

async function getIncidentController(req: Request, res: Response) {
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

    const incident = await getIncidentByIdModel(incidentId);

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

    const canView = await checkUserCanViewIncident({
      userId,
      workspaceId,
      teamId: incident.team_id,
      scope: incident.scope,
    });

    if (!canView) {
      return safeReject(res, {
        message: "You do not have permission to perform this action.",
        path: req.originalUrl,
        status: 403,
      });
    }

    return safeResponse(res, {
      message: "Incident fetched successfully",
      path: req.originalUrl,
      status: 200,
      data: {
        id: incident.id,
        title: incident.title,
        status: incident.status,
        severity: incident.severity,
        description: incident.description,
        scope: incident.scope,
        workspace: {
          id: incident.workspace_id,
          name: incident.workspace_name,
        },
        team: incident.team_id
          ? { id: incident.team_id, name: incident.team_name }
          : null,
        createdBy: incident.created_by_name,
        createdAt: incident.created_at,
        updatedAt: incident.updated_at,
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

export default getIncidentController;
