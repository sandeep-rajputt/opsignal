import { pool } from "../../config/db.js";
import type { ROLE } from "../../rbac/roles.js";

/**
 * Model for adding a workspace member with specified role
 */
async function addWorkspaceMemberModel({
  userId,
  workspaceId,
  teamId,
  role,
  invitedBy,
}: {
  userId: string;
  workspaceId: string;
  teamId: string;
  role: ROLE;
  invitedBy: string;
}): Promise<{ success: boolean; memberId?: string }> {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      INSERT INTO members(user_id, workspace_id, team_id, role, invited_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
      `,
      [userId, workspaceId, teamId, role, invitedBy],
    );

    return {
      success: result.rowCount !== null && result.rowCount > 0,
      memberId: result.rows[0]?.id,
    };
  } finally {
    client.release();
  }
}

export default addWorkspaceMemberModel;
