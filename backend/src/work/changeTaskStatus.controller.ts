import type { Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import safeResponse from "../utils/safeResponse.js";
import { changeTaskStatusValidation } from "./changeTaskStatus.validation.js";
import {
  getTaskForStatusChangeModel,
  changeTaskStatusModel,
} from "./changeTaskStatus.model.js";
import { canChangeTaskStatus } from "./changeTaskStatus.service.js";

async function changeTaskStatusController(req: Request, res: Response) {
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

    const resData = await changeTaskStatusValidation.safeParseAsync(req.body);

    if (!resData.success) {
      return safeReject(res, {
        message: "Invalid input",
        path: req.originalUrl,
        status: 400,
      });
    }

    const { status } = resData.data;

    const task = await getTaskForStatusChangeModel(taskId);

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

    if (task.status === status) {
      return safeReject(res, {
        message: "Task already has this status",
        path: req.originalUrl,
        status: 400,
      });
    }

    const allowed = await canChangeTaskStatus({
      userId,
      workspaceId,
      scope: task.scope,
      teamId: task.team_id,
    });

    if (!allowed) {
      return safeReject(res, {
        message: "You do not have permission to perform this action.",
        path: req.originalUrl,
        status: 403,
      });
    }

    const updated = await changeTaskStatusModel({
      taskId,
      status,
      actorId: userId,
      workspaceId,
      fromStatus: task.status,
    });

    if (!updated) {
      return safeReject(res, {
        message: "Something went wrong",
        path: req.originalUrl,
        status: 500,
      });
    }

    return safeResponse(res, {
      message: "Task status updated successfully",
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

export default changeTaskStatusController;
