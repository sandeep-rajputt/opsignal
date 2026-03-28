import type { Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import safeResponse from "../utils/safeResponse.js";
import {
  getIncidentForLogsModel,
  getIncidentLogsModel,
  checkUserCanViewIncidentLogs,
} from "./getIncidentLogs.model.js";
import { transformIncidentLogsToWorkLogs } from "./getIncidentLogs.service.js";

async function getIncidentLogsController(req: Request, res: Response) {
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

    const incident = await getIncidentForLogsModel(incidentId);

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

    const canView = await checkUserCanViewIncidentLogs({
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

    const logs = await getIncidentLogsModel(incidentId);

    const workLogs = transformIncidentLogsToWorkLogs(logs);

    return safeResponse(res, {
      message: "Incident logs fetched successfully",
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

export default getIncidentLogsController;
