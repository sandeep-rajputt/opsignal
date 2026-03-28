import type { Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import safeResponse from "../utils/safeResponse.js";
import {
  getTaskForLogsModel,
  getTaskLogsModel,
  checkUserCanViewTaskLogs,
} from "./getTaskLogs.model.js";
import { transformTaskLogsToWorkLogs } from "./getTaskLogs.service.js";

async function getTaskLogsController(req: Request, res: Response) {
  try {
    const workspaceId = req.params.id;
    const taskId = req.params.taskId;
    const userId = req.user?.id;

    if (!userId || !workspaceId || !taskId) {
      return safeReject(res, {
        message: "Unauthorized",
        path: req.originalUrl,
        status: 401,
      });
    }

    const task = await getTaskForLogsModel(taskId);

    if (!task) {
      return safeReject(res, {
        message: "Task not found",
        path: req.originalUrl,
        status: 404,
      });
    }

    if (task.workspace_id !== workspaceId) {
      return safeReject(res, {
        message: "Task not found",
        path: req.originalUrl,
        status: 404,
      });
    }

    const canView = await checkUserCanViewTaskLogs({
      userId,
      workspaceId,
      teamId: task.team_id,
      scope: task.scope,
    });

    if (!canView) {
      return safeReject(res, {
        message: "You do not have permission to perform this action.",
        path: req.originalUrl,
        status: 403,
      });
    }

    const logs = await getTaskLogsModel(taskId);

    const workLogs = transformTaskLogsToWorkLogs(logs);

    return safeResponse(res, {
      message: "Task logs fetched successfully",
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

export default getTaskLogsController;
