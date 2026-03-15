import { getUserRole } from "../rbac/rbac.service.js";
import { hasPermission, Permission } from "../rbac/permissions.js";
import { getUserTeamModel } from "./work.model.js";
import { ROLE } from "../rbac/roles.js";

// resolves the teamId and scope based on the user's permission
// if CREATE_WORKSPACE_WORK → trust the teamId from request
// if CREATE_TEAM_WORK → override with user's own team from db
// otherwise → null (no permission)
export async function resolveWorkScope({
  userId,
  workspaceId,
  requestedTeamId,
}: {
  userId: string;
  workspaceId: string;
  requestedTeamId: string;
}): Promise<{ teamId: string | null; scope: "global" | "team" } | null> {
  const role = await getUserRole(userId, workspaceId);

  if (!role) return null;

  const canWorkspaceWork = hasPermission({
    role,
    permission: Permission.CREATE_WORKSPACE_WORK,
  });

  if (canWorkspaceWork) {
    if (requestedTeamId === "global") {
      return { teamId: null, scope: "global" };
    }
    return { teamId: requestedTeamId, scope: "team" };
  }

  const canTeamWork = hasPermission({
    role,
    permission: Permission.CREATE_TEAM_WORK,
  });

  if (canTeamWork) {
    const userTeamId = await getUserTeamModel({ userId, workspaceId });
    if (!userTeamId) return null;
    return { teamId: userTeamId, scope: "team" };
  }

  return null;
}
