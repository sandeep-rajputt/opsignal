import express from "express";
import ipRateLimiter from "../middlewares/ipRateLimiter.js";
import createIncidentController from "./createIncident.controller.js";
import createTaskController from "./createTask.controller.js";
import createImprovementController from "./createImprovement.controller.js";

const workRouter = express.Router({ mergeParams: true });

const createWorkRateLimit = ipRateLimiter({
  path: "create-work",
  maxRequests: 10,
  timeInSeconds: 60,
});

workRouter.post("/incident", createWorkRateLimit, createIncidentController);
workRouter.post("/task", createWorkRateLimit, createTaskController);
workRouter.post(
  "/improvement",
  createWorkRateLimit,
  createImprovementController,
);

export default workRouter;
