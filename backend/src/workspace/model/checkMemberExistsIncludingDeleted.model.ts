import { pool } from "../../config/db.js";

/**
 * Model for checking if user was ever a member (including soft-deleted)
 * and reactivating them if they were soft-deleted
 */
export async function reactivateMemberIfDeletedModel({
  userId,
  workspaceId,
  teamId,
  role,
}: {
  userId: string;
  workspaceId: string;
  teamId: string;
  role: string;
}): Promise<{ wasReactivated: boolean; memberId?: string }> {
  const client = await pool.connect();

  try {
    // Check if member exists (including deleted)
    const checkRes = await client.query(
      `
      SELECT id, deleted_at
      FROM members
      WHERE user_id = $1 AND workspace_id = $2
      `,
      [userId, workspaceId],
    );

    if (checkRes.rowCount === 0) {
      // Member never existed
      return { wasReactivated: false };
    }

    const existingMember = checkRes.rows[0];

    if (existingMember.deleted_at === null) {
      // Member is active, cannot reactivate
      return { wasReactivated: false };
    }

    // Reactivate the soft-deleted member
    const updateRes = await client.query(
      `
      UPDATE members
      SET 
        deleted_at = NULL,
        team_id = $3,
        role = $4,
        updated_at = NOW()
      WHERE user_id = $1 AND workspace_id = $2
      RETURNING id
      `,
      [userId, workspaceId, teamId, role],
    );

    return {
      wasReactivated: true,
      memberId: updateRes.rows[0]?.id,
    };
  } finally {
    client.release();
  }
}

export default reactivateMemberIfDeletedModel;
