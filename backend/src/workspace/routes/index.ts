import express from "express";
import basicWorkspaceRouter from "./workspace.routes.js";
import primaryWorkspaceController, {
  checkPrimaryWorkspaceController,
} from "../controllers/primaryWorkspace.controller.js";
import getAllWorkspaceController from "../controllers/getAllWorkspace.controller.js";
import createWorkspaceController from "../controllers/createWorkspace.controller.js";
import workRouter from "../../work/work.routes.js";

const workspaceRouter = express.Router();

workspaceRouter.get("/get-all-workspace", getAllWorkspaceController);
workspaceRouter.post("/create-primary-workspace", primaryWorkspaceController);
workspaceRouter.post("/create-workspace", createWorkspaceController);
workspaceRouter.get("/check-primary", checkPrimaryWorkspaceController);

workspaceRouter.use("/:id", basicWorkspaceRouter);
workspaceRouter.use("/:id/work", workRouter);

export default workspaceRouter;
