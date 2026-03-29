import { query } from "../config/db.js";

export async function checkUserWorkspaceMembership({
  userId,
  workspaceId,
}: {
  userId: string;
  workspaceId: string;
}) {
  const res = await query<{ exists: boolean }>(
    `
    SELECT EXISTS (
      SELECT 1 FROM members
      WHERE user_id = $1
      AND workspace_id = $2
      AND deleted_at IS NULL
    )
    `,
    [userId, workspaceId],
  );

  return res[0]?.exists ?? false;
}

export async function getUserRoleInWorkspace({
  userId,
  workspaceId,
}: {
  userId: string;
  workspaceId: string;
}) {
  const res = await query<{ role: string; team_id: string | null }>(
    `
    SELECT role, team_id FROM members
    WHERE user_id = $1
    AND workspace_id = $2
    AND deleted_at IS NULL
    `,
    [userId, workspaceId],
  );

  return res[0] ?? null;
}

export async function getAllImprovementsModel({
  workspaceId,
  userId,
  role,
  teamId,
}: {
  workspaceId: string;
  userId: string;
  role: string;
  teamId: string | null;
}) {
  const isAdminOrOwner = role === "owner" || role === "admin";

  const res = await query<{
    id: string;
    title: string;
    status: string;
    category: string;
    description: string | null;
    expected_impact: string | null;
    scope: string;
    team_id: string | null;
    workspace_id: string;
    workspace_name: string;
    team_name: string | null;
    created_by_name: string;
    created_by_id: string;
    created_at: string;
    updated_at: string;
  }>(
    `
    SELECT
      i.id,
      i.title,
      i.status,
      i.category,
      i.description,
      i.expected_impact,
      i.scope,
      i.team_id,
      i.workspace_id,
      w.name AS workspace_name,
      t.name AS team_name,
      u.name AS created_by_name,
      u.id AS created_by_id,
      i.created_at,
      i.updated_at
    FROM improvements i
    JOIN workspaces w ON w.slug = i.workspace_id
    LEFT JOIN teams t ON t.id = i.team_id
    JOIN users u ON u.id = i.created_by
    WHERE i.workspace_id = $1
    AND i.deleted_at IS NULL
    AND (
      $2 = true
      OR i.scope = 'global'
      OR (i.scope = 'team' AND i.team_id = $3)
    )
    ORDER BY i.created_at DESC
    `,
    [workspaceId, isAdminOrOwner, teamId],
  );

  return res.map((improvement) => ({
    id: improvement.id,
    title: improvement.title,
    status: improvement.status,
    category: improvement.category,
    description: improvement.description,
    expectedImpact: improvement.expected_impact,
    scope: improvement.scope,
    workspace: {
      id: improvement.workspace_id,
      name: improvement.workspace_name,
    },
    team: improvement.team_id
      ? { id: improvement.team_id, name: improvement.team_name }
      : null,
    createdBy: improvement.created_by_name,
    createdById: improvement.created_by_id,
    createdAt: improvement.created_at,
    updatedAt: improvement.updated_at,
  }));
}
