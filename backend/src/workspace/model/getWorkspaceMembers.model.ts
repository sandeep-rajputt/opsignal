import type { ROLE } from "../../rbac/roles.js";
import { pool } from "../../config/db.js";

async function getWorkspaceMembersModel({
  workspaceId,
  role = null,
  team = null,
  page = 1,
  limit = 10,
}: {
  workspaceId: string;
  role?: ROLE | null;
  team?: string | null;
  page?: number;
  limit?: number;
}) {
  const offset = (page - 1) * limit;
  const client = await pool.connect();

  try {
    // ---------------- TOTAL ----------------
    const totalRes = await client.query(
      `
      SELECT COUNT(*)
      FROM members m
      WHERE
        m.workspace_id = $1
        AND m.deleted_at IS NULL
        AND ($2::member_role IS NULL OR m.role = $2)
        AND ($3::uuid IS NULL OR m.team_id = $3);
      `,
      [workspaceId, role, team],
    );

    // ---------------- DATA ----------------
    const dataRes = await client.query(
      `
      SELECT
        m.id,
        m.role,
        m.joined_at,
        u.id AS user_id,
        u.name,
        u.email,
        u.avatar_url
      FROM members m
      JOIN users u ON u.id = m.user_id
      WHERE
        m.workspace_id = $1
        AND m.deleted_at IS NULL
        AND ($2::member_role IS NULL OR m.role = $2)
        AND ($3::uuid IS NULL OR m.team_id = $3)
      ORDER BY m.joined_at DESC
      LIMIT $4 OFFSET $5;
      `,
      [workspaceId, role, team, limit, offset],
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

export default getWorkspaceMembersModel;
