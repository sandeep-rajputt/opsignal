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
import rateLimiter from "../../middlewares/rateLimiter.js";

const basicWorkspaceRouter = express.Router({ mergeParams: true });

const getWorkspaceRateLimit = rateLimiter({
  path: "get-workspace-info",
  maxRequests: 30,
  timeInSeconds: 60,
});

const updateWorkspaceRateLimit = rateLimiter({
  path: "update-workspace",
  maxRequests: 10,
  timeInSeconds: 60,
});

basicWorkspaceRouter.get("/role", getWorkspaceRateLimit, getUserRoleController);

basicWorkspaceRouter.get(
  "/basic-info",
  getWorkspaceRateLimit,
  getWorkspaceBasicInfoController,
);

basicWorkspaceRouter.get(
  "/teams",
  getWorkspaceRateLimit,
  getWorkspaceTeamsController,
);

basicWorkspaceRouter.get("/team", getWorkspaceRateLimit, getUserTeamController);

basicWorkspaceRouter.get(
  "/members",
  getWorkspaceRateLimit,
  requirePermission(Permission.SEE_WORKSPACE_MEMBERS),
  getWorkspaceMembersController,
);

basicWorkspaceRouter.get(
  "/members-list",
  getWorkspaceRateLimit,
  getMembersController,
);

basicWorkspaceRouter.delete(
  "/members/:memberId",
  updateWorkspaceRateLimit,
  requirePermission(Permission.REMOVE_WORKSPACE_MEMBER),
  removeMemberController,
);

basicWorkspaceRouter.patch(
  "/members/:memberId/role",
  updateWorkspaceRateLimit,
  requirePermission(Permission.UPDATE_MEMBER_ROLE),
  updateMemberRoleController,
);

basicWorkspaceRouter.patch(
  "/settings",
  updateWorkspaceRateLimit,
  requirePermission(Permission.EDIT_WORKSPACE),
  updateWorkspaceSettingsController,
);

basicWorkspaceRouter.get(
  "/check-slug",
  getWorkspaceRateLimit,
  requirePermission(Permission.EDIT_WORKSPACE),
  checkSlugAvailabilityController,
);

export default basicWorkspaceRouter;
