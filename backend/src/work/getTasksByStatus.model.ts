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

export async function getTasksByStatusModel({
  workspaceId,
  teamId,
}: {
  workspaceId: string;
  teamId: string | null;
}) {
  const isWorkspaceLevel = teamId === null;

  const res = await query<{
    status: string;
    count: string;
  }>(
    `
    SELECT
      status,
      COUNT(*) as count
    FROM tasks
    WHERE workspace_id = $1
    AND deleted_at IS NULL
    AND ($2 = true OR scope = 'global' OR (scope = 'team' AND team_id = $3))
    GROUP BY status
    ORDER BY
      CASE status
        WHEN 'open' THEN 1
        WHEN 'in_progress' THEN 2
        WHEN 'blocked' THEN 3
        WHEN 'done' THEN 4
        WHEN 'cancelled' THEN 5
      END
    `,
    [workspaceId, isWorkspaceLevel, teamId],
  );

  const statusMap: Record<string, number> = {
    open: 0,
    in_progress: 0,
    blocked: 0,
    done: 0,
    cancelled: 0,
  };

  res.forEach((row) => {
    statusMap[row.status] = parseInt(row.count ?? "0");
  });

  return {
    open: statusMap.open ?? 0,
    inProgress: statusMap.in_progress ?? 0,
    blocked: statusMap.blocked ?? 0,
    done: statusMap.done ?? 0,
    cancelled: statusMap.cancelled ?? 0,
  };
}
