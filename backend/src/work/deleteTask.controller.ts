import type { Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import safeResponse from "../utils/safeResponse.js";
import { getTaskOwnerModel, softDeleteTaskModel } from "./deleteWork.model.js";
import { canDeleteWork } from "./deleteWork.service.js";

async function deleteTaskController(req: Request, res: Response) {
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

    const task = await getTaskOwnerModel(taskId);

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

    const allowed = await canDeleteWork({
      userId,
      workspaceId,
      createdBy: task.created_by,
      teamId: task.team_id,
    });

    if (!allowed) {
      return safeReject(res, {
        message: "You do not have permission to perform this action.",
        path: req.originalUrl,
        status: 403,
      });
    }

    const deleted = await softDeleteTaskModel(taskId);

    if (!deleted) {
      return safeReject(res, {
        message: "Something went wrong",
        path: req.originalUrl,
        status: 500,
      });
    }

    return safeResponse(res, {
      message: "Task deleted successfully",
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

export default deleteTaskController;
