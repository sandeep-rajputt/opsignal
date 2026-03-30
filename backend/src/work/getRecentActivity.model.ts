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

export async function getRecentActivityModel({
  workspaceId,
  teamId,
  limit = 10,
}: {
  workspaceId: string;
  teamId: string | null;
  limit?: number;
}) {
  const isWorkspaceLevel = teamId === null;

  const res = await query<{
    id: string;
    type: string;
    title: string;
    status: string;
    severity_or_priority: string | null;
    category: string | null;
    created_by_name: string;
    created_by_id: string;
    created_at: string;
    team_name: string | null;
  }>(
    `
    (
      SELECT
        i.id,
        'incident' AS type,
        i.title,
        i.status::text AS status,
        i.severity::text AS severity_or_priority,
        NULL AS category,
        u.name AS created_by_name,
        u.id AS created_by_id,
        i.created_at,
        t.name AS team_name
      FROM incidents i
      JOIN users u ON u.id = i.created_by
      LEFT JOIN teams t ON t.id = i.team_id
      WHERE i.workspace_id = $1
      AND i.deleted_at IS NULL
      AND ($2 = true OR i.scope = 'global' OR (i.scope = 'team' AND i.team_id = $3))
    )
    UNION ALL
    (
      SELECT
        tk.id,
        'task' AS type,
        tk.title,
        tk.status::text AS status,
        tk.priority::text AS severity_or_priority,
        NULL AS category,
        u.name AS created_by_name,
        u.id AS created_by_id,
        tk.created_at,
        t.name AS team_name
      FROM tasks tk
      JOIN users u ON u.id = tk.created_by
      LEFT JOIN teams t ON t.id = tk.team_id
      WHERE tk.workspace_id = $1
      AND tk.deleted_at IS NULL
      AND ($2 = true OR tk.scope = 'global' OR (tk.scope = 'team' AND tk.team_id = $3))
    )
    UNION ALL
    (
      SELECT
        im.id,
        'improvement' AS type,
        im.title,
        im.status::text AS status,
        NULL AS severity_or_priority,
        im.category::text AS category,
        u.name AS created_by_name,
        u.id AS created_by_id,
        im.created_at,
        t.name AS team_name
      FROM improvements im
      JOIN users u ON u.id = im.created_by
      LEFT JOIN teams t ON t.id = im.team_id
      WHERE im.workspace_id = $1
      AND im.deleted_at IS NULL
      AND ($2 = true OR im.scope = 'global' OR (im.scope = 'team' AND im.team_id = $3))
    )
    ORDER BY created_at DESC
    LIMIT $4
    `,
    [workspaceId, isWorkspaceLevel, teamId, limit],
  );

  return res.map((activity) => ({
    id: activity.id,
    type: activity.type,
    title: activity.title,
    status: activity.status,
    severityOrPriority: activity.severity_or_priority,
    category: activity.category,
    createdBy: activity.created_by_name,
    createdById: activity.created_by_id,
    createdAt: activity.created_at,
    teamName: activity.team_name,
  }));
}
