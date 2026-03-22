import type { Request, Response } from "express";
import safeReject from "../utils/safeReject.js";
import safeResponse from "../utils/safeResponse.js";
import { getTaskByIdModel, checkUserCanViewTask } from "./getTask.model.js";

async function getTaskController(req: Request, res: Response) {
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

    const task = await getTaskByIdModel(taskId);

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

    const canView = await checkUserCanViewTask({
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

    return safeResponse(res, {
      message: "Task fetched successfully",
      path: req.originalUrl,
      status: 200,
      data: {
        id: task.id,
        title: task.title,
        status: task.status,
        priority: task.priority,
        description: task.description,
        scope: task.scope,
        workspace: {
          id: task.workspace_id,
          name: task.workspace_name,
        },
        team: task.team_id ? { id: task.team_id, name: task.team_name } : null,
        createdBy: task.created_by_name,
        createdById: task.created_by_id,
        dueDate: task.due_date,
        createdAt: task.created_at,
        updatedAt: task.updated_at,
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

export default getTaskController;
