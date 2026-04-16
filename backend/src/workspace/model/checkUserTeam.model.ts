import { pool } from "../../config/db.js";

/**
 * Model for checking if user belongs to a specific team
 */
async function checkUserBelongsToTeamModel({
  userId,
  teamId,
  workspaceId,
}: {
  userId: string;
  teamId: string;
  workspaceId: string;
}): Promise<boolean> {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT id
      FROM members
      WHERE user_id = $1 
        AND team_id = $2 
        AND workspace_id = $3 
        AND deleted_at IS NULL
      `,
      [userId, teamId, workspaceId],
    );

    return result.rowCount !== null && result.rowCount > 0;
  } finally {
    client.release();
  }
}

export default checkUserBelongsToTeamModel;
