import { pool } from "../../config/db.js";

/**
 * Model for getting all team IDs that a user belongs to in a workspace
 */
async function getUserTeamsModel({
  userId,
  workspaceId,
}: {
  userId: string;
  workspaceId: string;
}): Promise<string[]> {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT DISTINCT team_id
      FROM members
      WHERE user_id = $1
        AND workspace_id = $2
        AND deleted_at IS NULL
        AND team_id IS NOT NULL;
      `,
      [userId, workspaceId],
    );

    return result.rows.map((row) => row.team_id);
  } finally {
    client.release();
  }
}

export default getUserTeamsModel;
