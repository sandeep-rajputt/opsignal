import type { Request, Response } from "express";
import safeResponse from "../../utils/safeResponse.js";
import safeReject from "../../utils/safeReject.js";
import { getWorkspaceTeamsService } from "../service/getWorkspaceTeams.service.js";

export async function getWorkspaceTeamsController(req: Request, res: Response) {
  try {
    const workspaceId = req.params.id;

    if (!workspaceId) {
      return safeReject(res, {
        message: "Workspace not found",
        path: req.originalUrl,
        status: 400,
      });
    }

    const teams = await getWorkspaceTeamsService(workspaceId);

    return safeResponse(res, {
      message: "Teams fetched successfully",
      data: teams,
      path: req.originalUrl,
      status: 200,
    });
  } catch (error) {
    console.error("Get workspace teams error:", error);
    return safeReject(res, {
      message: "Failed to fetch teams",
      path: req.originalUrl,
      status: 500,
    });
  }
}
