import { pool } from "../../config/db.js";

/**
 * Model for checking if user exists and getting their workspace count
 */
export async function checkUserExistsAndSlotsModel(email: string): Promise<{
  exists: boolean;
  userId?: string;
  name?: string;
  slots?: number;
  currentWorkspaces?: number;
}> {
  const client = await pool.connect();

  try {
    // Check if user exists and get their slots
    const userRes = await client.query(
      `
      SELECT id, name, slots
      FROM users
      WHERE email = $1 AND deleted_at IS NULL
      `,
      [email],
    );

    if (userRes.rowCount === 0) {
      return { exists: false };
    }

    const user = userRes.rows[0];

    // Count current active workspaces
    const workspaceCountRes = await client.query(
      `
      SELECT COUNT(*) as count
      FROM members
      WHERE user_id = $1 AND deleted_at IS NULL
      `,
      [user.id],
    );

    return {
      exists: true,
      userId: user.id,
      name: user.name,
      slots: user.slots,
      currentWorkspaces: Number(workspaceCountRes.rows[0].count),
    };
  } finally {
    client.release();
  }
}

/**
 * Model for checking if user is already a member of the workspace
 */
export async function checkMemberExistsModel({
  userId,
  workspaceId,
}: {
  userId: string;
  workspaceId: string;
}): Promise<boolean> {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT id
      FROM members
      WHERE user_id = $1 AND workspace_id = $2 AND deleted_at IS NULL
      `,
      [userId, workspaceId],
    );

    return result.rowCount !== null && result.rowCount > 0;
  } finally {
    client.release();
  }
}

/**
 * Model for checking if team belongs to workspace
 */
export async function checkTeamBelongsToWorkspaceModel({
  teamId,
  workspaceId,
}: {
  teamId: string;
  workspaceId: string;
}): Promise<boolean> {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      SELECT id
      FROM teams
      WHERE id = $1 AND workspace_id = $2 AND deleted_at IS NULL
      `,
      [teamId, workspaceId],
    );

    return result.rowCount !== null && result.rowCount > 0;
  } finally {
    client.release();
  }
}

/**
 * Model for adding a team member
 */
async function addTeamMemberModel({
  userId,
  workspaceId,
  teamId,
  invitedBy,
}: {
  userId: string;
  workspaceId: string;
  teamId: string;
  invitedBy: string;
}): Promise<{ success: boolean; memberId?: string }> {
  const client = await pool.connect();

  try {
    const result = await client.query(
      `
      INSERT INTO members(user_id, workspace_id, team_id, role, invited_by)
      VALUES ($1, $2, $3, 'member', $4)
      RETURNING id
      `,
      [userId, workspaceId, teamId, invitedBy],
    );

    return {
      success: result.rowCount !== null && result.rowCount > 0,
      memberId: result.rows[0]?.id,
    };
  } finally {
    client.release();
  }
}

export default addTeamMemberModel;
