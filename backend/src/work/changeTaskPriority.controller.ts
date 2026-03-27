import type { Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import safeResponse from "../utils/safeResponse.js";
import { changeTaskPriorityValidation } from "./changeTaskPriority.validation.js";
import {
  getTaskForPriorityChangeModel,
  changeTaskPriorityModel,
} from "./changeTaskPriority.model.js";
import { canChangeTaskPriority } from "./changeTaskPriority.service.js";

async function changeTaskPriorityController(req: Request, res: Response) {
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

    const resData = await changeTaskPriorityValidation.safeParseAsync(req.body);

    if (!resData.success) {
      return safeReject(res, {
        message: "Invalid input",
        path: req.originalUrl,
        status: 400,
      });
    }

    const { priority } = resData.data;

    const task = await getTaskForPriorityChangeModel(taskId);

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

    if (task.priority === priority) {
      return safeReject(res, {
        message: "Task already has this priority",
        path: req.originalUrl,
        status: 400,
      });
    }

    const allowed = await canChangeTaskPriority({
      userId,
      workspaceId,
      scope: task.scope,
      teamId: task.team_id,
      createdBy: task.created_by,
    });

    if (!allowed) {
      return safeReject(res, {
        message: "You do not have permission to perform this action.",
        path: req.originalUrl,
        status: 403,
      });
    }

    const updated = await changeTaskPriorityModel({
      taskId,
      priority,
      actorId: userId,
      workspaceId,
      fromPriority: task.priority,
    });

    if (!updated) {
      return safeReject(res, {
        message: "Something went wrong",
        path: req.originalUrl,
        status: 500,
      });
    }

    return safeResponse(res, {
      message: "Task priority updated successfully",
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

export default changeTaskPriorityController;
