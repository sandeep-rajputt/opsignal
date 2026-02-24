import { pool } from "../../config/db.js";
import type { ROLE } from "../../rbac/roles.js";

/**
 * Model for getting a user's role in a workspace
 */
async function getMemberRoleModel({
  userId,
  workspaceId,
}: {
  userId: string;
  workspaceId: string;
}): Promise<ROLE | null> {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT role
      FROM members
      WHERE user_id = $1
        AND workspace_id = $2
        AND deleted_at IS NULL
      LIMIT 1;
      `,
      [userId, workspaceId],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].role as ROLE;
  } finally {
    client.release();
  }
}

export default getMemberRoleModel;
