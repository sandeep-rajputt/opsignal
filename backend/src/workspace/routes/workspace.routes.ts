import express from "express";
import { getUserRoleController } from "../controllers/getUserRole.controller.js";
import { getWorkspaceMembersController } from "../controllers/getWorkspaceMembers.controller.js";
import { getWorkspaceBasicInfoController } from "../controllers/getWorkspaceBasicInfo.controller.js";
import { requirePermission } from "../../middlewares/rbac.middleware.js";
import { Permission } from "../../rbac/permissions.js";

const basicWorkspaceRouter = express.Router({ mergeParams: true });

basicWorkspaceRouter.get("/role", getUserRoleController);

basicWorkspaceRouter.get("/basic-info", getWorkspaceBasicInfoController);

basicWorkspaceRouter.get(
  "/members",
  requirePermission(Permission.SEE_WORKSPACE_MEMBERS),
  getWorkspaceMembersController,
);

export default basicWorkspaceRouter;
