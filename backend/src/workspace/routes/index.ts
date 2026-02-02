import express from "express";
import basicWorkspaceRouter from "./workspace.routes.js";
import primaryWorkspaceController, {
  checkPrimaryWorkspaceController,
} from "../controllers/primaryWorkspace.controller.js";

const workspaceRouter = express.Router();

workspaceRouter.post("/create-primary-workspace", primaryWorkspaceController);
workspaceRouter.get("/check-primary", checkPrimaryWorkspaceController);

workspaceRouter.use("/:id/", basicWorkspaceRouter);

export default workspaceRouter;
