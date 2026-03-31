import express from "express";
import basicWorkspaceRouter from "./workspace.routes.js";
import primaryWorkspaceController, {
  checkPrimaryWorkspaceController,
} from "../controllers/primaryWorkspace.controller.js";
import getAllWorkspaceController from "../controllers/getAllWorkspace.controller.js";
import createWorkspaceController from "../controllers/createWorkspace.controller.js";
import workRouter from "../../work/work.routes.js";
import rateLimiter from "../../middlewares/rateLimiter.js";

const workspaceRouter = express.Router();

workspaceRouter.get(
  "/get-all-workspace",
  rateLimiter({
    maxRequests: 30,
    timeInSeconds: 60,
    path: "get-all-workspace",
  }),
  getAllWorkspaceController,
);

workspaceRouter.post(
  "/create-primary-workspace",
  rateLimiter({
    maxRequests: 5,
    timeInSeconds: 60 * 60,
    path: "create-primary-workspace",
  }),
  primaryWorkspaceController,
);

workspaceRouter.post(
  "/create-workspace",
  rateLimiter({
    maxRequests: 10,
    timeInSeconds: 60 * 60,
    path: "create-workspace",
  }),
  createWorkspaceController,
);

workspaceRouter.get(
  "/check-primary",
  rateLimiter({
    maxRequests: 30,
    timeInSeconds: 60,
    path: "check-primary",
  }),
  checkPrimaryWorkspaceController,
);

workspaceRouter.use("/:id", basicWorkspaceRouter);
workspaceRouter.use("/:id/work", workRouter);

export default workspaceRouter;
