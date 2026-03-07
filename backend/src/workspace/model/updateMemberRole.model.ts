import { pool } from "../../config/db.js";
import type { ROLE } from "../../rbac/roles.js";

/**
 * Model for updating a member's role in a workspace
 */
async function updateMemberRoleModel({
  memberId,
  workspaceId,
  newRole,
}: {
  memberId: string;
  workspaceId: string;
  newRole: ROLE;
}): Promise<{ success: boolean }> {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      UPDATE members
      SET role = $1
      WHERE user_id = $2
        AND workspace_id = $3
        AND deleted_at IS NULL
      RETURNING id;
      `,
      [newRole, memberId, workspaceId],
    );

    return {
      success: result.rowCount !== null && result.rowCount > 0,
    };
  } finally {
    client.release();
  }
}

export default updateMemberRoleModel;
