import { query } from "../config/db.js";
import type { UserRole } from "../user/user.types.js";

export async function getUserRoleModel({
  userId,
  workspaceId,
}: {
  userId: string;
  workspaceId: string;
}) {
  const res = await query<{ role: UserRole }>(
    `
    SELECT m.role
    FROM members m
    WHERE m.user_id = $1 AND m.workspace_id = $2 AND m.deleted_at IS NULL
    `,
    [userId, workspaceId],
  );

  return res[0]?.role;
}
