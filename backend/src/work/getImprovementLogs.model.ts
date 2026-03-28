import { query } from "../config/db.js";

export async function getImprovementForLogsModel(improvementId: string) {
  const res = await query<{
    id: string;
    scope: string;
    team_id: string | null;
    workspace_id: string;
  }>(
    `
    SELECT id, scope, team_id, workspace_id
    FROM improvements
    WHERE id = $1 AND deleted_at IS NULL
    `,
    [improvementId],
  );

  return res[0] ?? null;
}

export async function getImprovementLogsModel(improvementId: string) {
  const res = await query<{
    log_id: string;
    log_type: string;
    actor_id: string;
    actor_name: string;
    created_at: string;
    from_value: string | null;
    to_value: string | null;
  }>(
    `
    SELECT
      wl.id AS log_id,
      wl.log_type,
      wl.actor_id,
      u.name AS actor_name,
      wl.created_at,
      COALESCE(isl.from_value::text, icl.from_value::text) AS from_value,
      COALESCE(isl.to_value::text, icl.to_value::text) AS to_value
    FROM work_logs wl
    JOIN users u ON u.id = wl.actor_id
    LEFT JOIN improvement_status_logs isl ON isl.log_id = wl.id
    LEFT JOIN improvement_category_logs icl ON icl.log_id = wl.id
    WHERE wl.work_type = 'improvement'
    AND wl.work_id = $1
    ORDER BY wl.created_at DESC
    `,
    [improvementId],
  );

  return res;
}

export async function checkUserCanViewImprovementLogs({
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
