import express from "express";
import { getUserRoleController } from "../controllers/getUserRole.controller.js";
import { getWorkspaceMembersController } from "../controllers/getWorkspaceMembers.controller.js";
import { getWorkspaceBasicInfoController } from "../controllers/getWorkspaceBasicInfo.controller.js";
import { getWorkspaceTeamsController } from "../controllers/getWorkspaceTeams.controller.js";
import { getUserTeamController } from "../controllers/getUserTeam.controller.js";
import { getMembersController } from "../controllers/getMembers.controller.js";
import { removeMemberController } from "../controllers/removeMember.controller.js";
import { updateMemberRoleController } from "../controllers/updateMemberRole.controller.js";
import { updateWorkspaceSettingsController } from "../controllers/updateWorkspaceSettings.controller.js";
import { checkSlugAvailabilityController } from "../controllers/checkSlugAvailability.controller.js";
import { requirePermission } from "../../middlewares/rbac.middleware.js";
import { Permission } from "../../rbac/permissions.js";

const basicWorkspaceRouter = express.Router({ mergeParams: true });

basicWorkspaceRouter.get("/role", getUserRoleController);

basicWorkspaceRouter.get("/basic-info", getWorkspaceBasicInfoController);

basicWorkspaceRouter.get("/teams", getWorkspaceTeamsController);

basicWorkspaceRouter.get("/team", getUserTeamController);

basicWorkspaceRouter.get(
  "/members",
  requirePermission(Permission.SEE_WORKSPACE_MEMBERS),
  getWorkspaceMembersController,
);

// Members management routes - role-based visibility and removal
basicWorkspaceRouter.get("/members-list", getMembersController);

basicWorkspaceRouter.delete(
  "/members/:memberId",
  requirePermission(Permission.REMOVE_WORKSPACE_MEMBER),
  removeMemberController,
);

basicWorkspaceRouter.patch(
  "/members/:memberId/role",
  requirePermission(Permission.UPDATE_MEMBER_ROLE),
  updateMemberRoleController,
);

basicWorkspaceRouter.patch(
  "/settings",
  requirePermission(Permission.EDIT_WORKSPACE),
  updateWorkspaceSettingsController,
);

basicWorkspaceRouter.get(
  "/check-slug",
  requirePermission(Permission.EDIT_WORKSPACE),
  checkSlugAvailabilityController,
);

export default basicWorkspaceRouter;
