import { checkPermission, getUserRole } from "../rbac/rbac.service.js";
import { Permission } from "../rbac/permissions.js";
import { ROLE } from "../rbac/roles.js";
import { getUserTeamModel } from "./work.model.js";

export async function canChangeImprovementCategory({
  userId,
  workspaceId,
  scope,
  teamId,
  createdBy,
}: {
  userId: string;
  workspaceId: string;
  scope: string;
  teamId: string | null;
  createdBy: string;
}): Promise<boolean> {
  if (userId === createdBy) return true;

  if (scope === "global") {
    return checkPermission({
      userId,
      workspaceId,
      permission: Permission.CHANGE_WORKSPACE_WORK_CATEGORY,
    });
  }

  const allowed = await checkPermission({
    userId,
    workspaceId,
    permission: Permission.CHANGE_TEAM_WORK_CATEGORY,
  });

  if (!allowed) return false;

  const role = await getUserRole(userId, workspaceId);

  if (role === ROLE.OWNER || role === ROLE.ADMIN) return true;

  const userTeamId = await getUserTeamModel({ userId, workspaceId });

  return !!userTeamId && userTeamId === teamId;
}
