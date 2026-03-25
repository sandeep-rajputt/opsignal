import { checkPermission, getUserRole } from "../rbac/rbac.service.js";
import { Permission } from "../rbac/permissions.js";
import { ROLE } from "../rbac/roles.js";
import { getUserTeamModel } from "./work.model.js";

export async function canChangeIncidentStatus({
  userId,
  workspaceId,
  scope,
  teamId,
}: {
  userId: string;
  workspaceId: string;
  scope: string;
  teamId: string | null;
}): Promise<boolean> {
  if (scope === "global") {
    return checkPermission({
      userId,
      workspaceId,
      permission: Permission.CHANGE_WORKSPACE_WORK_STATUS,
    });
  }

  const allowed = await checkPermission({
    userId,
    workspaceId,
    permission: Permission.CHANGE_TEAM_WORK_STATUS,
  });

  if (!allowed) return false;

  const role = await getUserRole(userId, workspaceId);

  if (role === ROLE.OWNER || role === ROLE.ADMIN) return true;

  const userTeamId = await getUserTeamModel({ userId, workspaceId });

  return !!userTeamId && userTeamId === teamId;
}
