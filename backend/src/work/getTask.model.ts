import { query } from "../config/db.js";

export async function getTaskByIdModel(taskId: string) {
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
    WHERE t.id = $1
    AND t.deleted_at IS NULL
    `,
    [taskId],
  );

  return res[0] ?? null;
}

export async function checkUserCanViewTask({
  userId,
  workspaceId,
  teamId,
  scope,
}: {
  userId: string;
  workspaceId: string;
  teamId: string | null;
  scope: string;
}) {
  // global scope → any workspace member can view
  if (scope === "global") {
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

  // team scope → must be in that team, or be owner/admin
  const res = await query<{ role: string }>(
    `
    SELECT role FROM members
    WHERE user_id = $1
    AND workspace_id = $2
    AND deleted_at IS NULL
    `,
    [userId, workspaceId],
  );

  const role = res[0]?.role;
  if (!role) return false;

  if (role === "owner" || role === "admin") return true;

  const teamRes = await query<{ exists: boolean }>(
    `
    SELECT EXISTS (
      SELECT 1 FROM members
      WHERE user_id = $1
      AND workspace_id = $2
      AND team_id = $3
      AND deleted_at IS NULL
    )
    `,
    [userId, workspaceId, teamId],
  );

  return teamRes[0]?.exists ?? false;
}
