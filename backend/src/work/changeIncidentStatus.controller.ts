import type { Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import safeResponse from "../utils/safeResponse.js";
import { changeIncidentStatusValidation } from "./changeIncidentStatus.validation.js";
import {
  getIncidentForStatusChangeModel,
  changeIncidentStatusModel,
} from "./changeIncidentStatus.model.js";
import { canChangeIncidentStatus } from "./changeIncidentStatus.service.js";

async function changeIncidentStatusController(req: Request, res: Response) {
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

    const resData = await changeIncidentStatusValidation.safeParseAsync(
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

    const incident = await getIncidentForStatusChangeModel(incidentId);

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

    if (incident.status === status) {
      return safeReject(res, {
        message: "Incident already has this status",
        path: req.originalUrl,
        status: 400,
      });
    }

    const allowed = await canChangeIncidentStatus({
      userId,
      workspaceId,
      scope: incident.scope,
      teamId: incident.team_id,
    });

    if (!allowed) {
      return safeReject(res, {
        message: "You do not have permission to perform this action.",
        path: req.originalUrl,
        status: 403,
      });
    }

    const updated = await changeIncidentStatusModel({
      incidentId,
      status,
      actorId: userId,
      workspaceId,
      fromStatus: incident.status,
    });

    if (!updated) {
      return safeReject(res, {
        message: "Something went wrong",
        path: req.originalUrl,
        status: 500,
      });
    }

    return safeResponse(res, {
      message: "Incident status updated successfully",
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

export default changeIncidentStatusController;
