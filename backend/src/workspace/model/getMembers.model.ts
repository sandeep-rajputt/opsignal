import { pool } from "../../config/db.js";

/**
 * Model for fetching workspace members with team filtering and pagination
 * @param teamIds - Array of team IDs to filter by, or null for all members
 */
async function getMembersModel({
  workspaceId,
  teamIds = null,
  page = 1,
  limit = 10,
}: {
  workspaceId: string;
  teamIds?: string[] | null;
  page?: number;
  limit?: number;
}) {
  const offset = (page - 1) * limit;
  const client = await pool.connect();

  try {
    // Build the team filter condition
    let teamFilter = "";
    let countParams: any[] = [workspaceId];
    let dataParams: any[] = [workspaceId];

    if (teamIds !== null && teamIds.length > 0) {
      // Filter by specific teams
      teamFilter = `AND m.team_id = ANY($2)`;
      countParams.push(teamIds);
      dataParams.push(teamIds);
    }

    // ---------------- TOTAL COUNT ----------------
    const totalRes = await client.query(
      `
      SELECT COUNT(*)
      FROM members m
      WHERE
        m.workspace_id = $1
        AND m.deleted_at IS NULL
        ${teamFilter};
      `,
      countParams,
    );

    // ---------------- DATA ----------------
    const limitParamIndex = dataParams.length + 1;
    const offsetParamIndex = dataParams.length + 2;
    dataParams.push(limit, offset);

    const dataRes = await client.query(
      `
      SELECT
        m.id,
        m.role,
        m.joined_at,
        m.team_id,
        u.id AS user_id,
        u.name,
        u.email,
        u.avatar_url
      FROM members m
      JOIN users u ON u.id = m.user_id
      WHERE
        m.workspace_id = $1
        AND m.deleted_at IS NULL
        ${teamFilter}
      ORDER BY m.joined_at DESC
      LIMIT $${limitParamIndex} OFFSET $${offsetParamIndex};
      `,
      dataParams,
    );

    return {
      data: dataRes.rows,
      total: Number(totalRes.rows[0].count),
      page,
      limit,
    };
  } finally {
    client.release();
  }
}

export default getMembersModel;
