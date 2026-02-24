import { pool } from "../../config/db.js";

/**
 * Model for soft-deleting a member record
 * Sets deleted_at timestamp instead of actually deleting the record
 */
async function removeMemberModel({
  memberId,
  workspaceId,
}: {
  memberId: string;
  workspaceId: string;
}): Promise<{ success: boolean }> {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      UPDATE members
      SET deleted_at = NOW()
      WHERE user_id = $1
        AND workspace_id = $2
        AND deleted_at IS NULL
      RETURNING id;
      `,
      [memberId, workspaceId],
    );

    return {
      success: result.rowCount !== null && result.rowCount > 0,
    };
  } finally {
    client.release();
  }
}

export default removeMemberModel;
