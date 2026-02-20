import type { Request, Response } from "express";
import safeResponse from "../../utils/safeResponse.js";
import safeReject from "../../utils/safeReject.js";
import { getUserTeamService } from "../service/getUserTeam.service.js";

export async function getUserTeamController(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    const workspaceId = req.params.id;

    if (!userId || !workspaceId) {
      return safeReject(res, {
        message: "User or workspace not found",
        path: req.originalUrl,
        status: 400,
      });
    }

    const team = await getUserTeamService(userId, workspaceId);

    return safeResponse(res, {
      message: team ? "User team fetched successfully" : "User has no team",
      data: team,
      path: req.originalUrl,
      status: 200,
    });
  } catch (error) {
    console.error("Get user team error:", error);
    return safeReject(res, {
      message: "Failed to fetch user team",
      path: req.originalUrl,
      status: 500,
    });
  }
}
