import { checkPermission, getUserRole } from "../rbac/rbac.service.js";
import { Permission } from "../rbac/permissions.js";
import { ROLE } from "../rbac/roles.js";
import { query } from "../config/db.js";

// Returns true if the user can delete the work item.
// Allowed: the creator themselves, or owner/admin/moderator of the same team.
export async function canDeleteWork({
  userId,
  workspaceId,
  createdBy,
  teamId,
}: {
  userId: string;
  workspaceId: string;
  createdBy: string;
  teamId: string | null;
}): Promise<boolean> {
  // Creator can always delete their own work
  if (userId === createdBy) return true;

  const allowed = await checkPermission({
    userId,
    workspaceId,
    permission: Permission.DELETE_WORK,
  });

  if (!allowed) return false;

  const role = await getUserRole(userId, workspaceId);

  if (role === ROLE.OWNER || role === ROLE.ADMIN) return true;

  // Moderator can only delete work that belongs to their own team
  if (role === ROLE.MODERATOR && teamId) {
    const res = await query<{ team_id: string | null }>(
      `SELECT team_id FROM members WHERE user_id = $1 AND workspace_id = $2 AND team_id IS NOT NULL AND deleted_at IS NULL`,
      [userId, workspaceId],
    );
    const userTeamId = res[0]?.team_id;
    return !!userTeamId && userTeamId === teamId;
  }

  return false;
}
