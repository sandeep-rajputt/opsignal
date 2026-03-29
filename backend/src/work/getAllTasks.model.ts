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

export async function getAllTasksModel({
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
    priority: string;
    description: string | null;
    scope: string;
    team_id: string | null;
    workspace_id: string;
    workspace_name: string;
    team_name: string | null;
    created_by_name: string;
    created_by_id: string;
    due_date: string | null;
    created_at: string;
    updated_at: string;
  }>(
    `
    SELECT
      t.id,
      t.title,
      t.status,
      t.priority,
      t.description,
      t.scope,
      t.team_id,
      t.workspace_id,
      w.name AS workspace_name,
      tm.name AS team_name,
      u.name AS created_by_name,
      u.id AS created_by_id,
      t.due_date,
      t.created_at,
      t.updated_at
    FROM tasks t
    JOIN workspaces w ON w.slug = t.workspace_id
    LEFT JOIN teams tm ON tm.id = t.team_id
    JOIN users u ON u.id = t.created_by
    WHERE t.workspace_id = $1
    AND t.deleted_at IS NULL
    AND (
      $2 = true
      OR t.scope = 'global'
      OR (t.scope = 'team' AND t.team_id = $3)
    )
    ORDER BY t.created_at DESC
    `,
    [workspaceId, isAdminOrOwner, teamId],
  );

  return res.map((task) => ({
    id: task.id,
    title: task.title,
    status: task.status,
    priority: task.priority,
    description: task.description,
    scope: task.scope,
    workspace: {
      id: task.workspace_id,
      name: task.workspace_name,
    },
    team: task.team_id ? { id: task.team_id, name: task.team_name } : null,
    createdBy: task.created_by_name,
    createdById: task.created_by_id,
    dueDate: task.due_date,
    createdAt: task.created_at,
    updatedAt: task.updated_at,
  }));
}
