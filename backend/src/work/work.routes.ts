import express from "express";
import ipRateLimiter from "../middlewares/ipRateLimiter.js";
import createIncidentController from "./createIncident.controller.js";
import createTaskController from "./createTask.controller.js";
import createImprovementController from "./createImprovement.controller.js";
import getIncidentController from "./getIncident.controller.js";
import getTaskController from "./getTask.controller.js";
import getImprovementController from "./getImprovement.controller.js";
import getAllIncidentsController from "./getAllIncidents.controller.js";
import getAllTasksController from "./getAllTasks.controller.js";
import getAllImprovementsController from "./getAllImprovements.controller.js";
import getIncidentLogsController from "./getIncidentLogs.controller.js";
import getTaskLogsController from "./getTaskLogs.controller.js";
import getImprovementLogsController from "./getImprovementLogs.controller.js";
import deleteIncidentController from "./deleteIncident.controller.js";
import deleteTaskController from "./deleteTask.controller.js";
import deleteImprovementController from "./deleteImprovement.controller.js";
import changeIncidentStatusController from "./changeIncidentStatus.controller.js";
import changeIncidentSeverityController from "./changeIncidentSeverity.controller.js";
import changeTaskStatusController from "./changeTaskStatus.controller.js";
import changeTaskPriorityController from "./changeTaskPriority.controller.js";
import changeImprovementStatusController from "./changeImprovementStatus.controller.js";
import changeImprovementCategoryController from "./changeImprovementCategory.controller.js";
import getBasicFeedController from "./getBasicFeed.controller.js";
import { requirePermission } from "../middlewares/rbac.middleware.js";
import { Permission } from "../rbac/permissions.js";

const workRouter = express.Router({ mergeParams: true });

const createWorkRateLimit = ipRateLimiter({
  path: "create-work",
  maxRequests: 10,
  timeInSeconds: 60,
});

const changeWorkStatusRateLimit = ipRateLimiter({
  path: "change-work-status",
  maxRequests: 20,
  timeInSeconds: 60,
});

workRouter.post("/incident", createWorkRateLimit, createIncidentController);
workRouter.post("/task", createWorkRateLimit, createTaskController);
workRouter.post(
  "/improvement",
  createWorkRateLimit,
  createImprovementController,
);

const getWorkLogsRateLimit = ipRateLimiter({
  path: "get-work-logs",
  maxRequests: 30,
  timeInSeconds: 60,
});

const getAllWorkRateLimit = ipRateLimiter({
  path: "get-all-work",
  maxRequests: 30,
  timeInSeconds: 60,
});

workRouter.get(
  "/workspace-feed",
  getAllWorkRateLimit,
  requirePermission(Permission.WORKSPACE_BASIC_FEED),
  getBasicFeedController,
);
workRouter.get(
  "/team-feed",
  getAllWorkRateLimit,
  requirePermission(Permission.TEAM_BASIC_FEED),
  getBasicFeedController,
);
workRouter.get("/incidents", getAllWorkRateLimit, getAllIncidentsController);
workRouter.get("/tasks", getAllWorkRateLimit, getAllTasksController);
workRouter.get(
  "/improvements",
  getAllWorkRateLimit,
  getAllImprovementsController,
);
workRouter.get("/incident/:incidentId", getIncidentController);
workRouter.get("/task/:taskId", getTaskController);
workRouter.get("/improvement/:improvementId", getImprovementController);

workRouter.get(
  "/incident/:incidentId/logs",
  getWorkLogsRateLimit,
  getIncidentLogsController,
);

workRouter.get(
  "/task/:taskId/logs",
  getWorkLogsRateLimit,
  getTaskLogsController,
);

workRouter.get(
  "/improvement/:improvementId/logs",
  getWorkLogsRateLimit,
  getImprovementLogsController,
);

workRouter.delete("/incident/:incidentId", deleteIncidentController);
workRouter.delete("/task/:taskId", deleteTaskController);
workRouter.delete("/improvement/:improvementId", deleteImprovementController);

workRouter.patch(
  "/incident/:incidentId/status",
  changeWorkStatusRateLimit,
  changeIncidentStatusController,
);

workRouter.patch(
  "/incident/:incidentId/severity",
  changeWorkStatusRateLimit,
  changeIncidentSeverityController,
);

workRouter.patch(
  "/task/:taskId/status",
  changeWorkStatusRateLimit,
  changeTaskStatusController,
);

workRouter.patch(
  "/task/:taskId/priority",
  changeWorkStatusRateLimit,
  changeTaskPriorityController,
);

workRouter.patch(
  "/improvement/:improvementId/status",
  changeWorkStatusRateLimit,
  changeImprovementStatusController,
);

workRouter.patch(
  "/improvement/:improvementId/category",
  changeWorkStatusRateLimit,
  changeImprovementCategoryController,
);

export default workRouter;
