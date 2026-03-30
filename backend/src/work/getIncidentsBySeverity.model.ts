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

export async function getIncidentsBySeverityModel({
  workspaceId,
  teamId,
}: {
  workspaceId: string;
  teamId: string | null;
}) {
  const isWorkspaceLevel = teamId === null;

  const res = await query<{
    severity: string;
    count: string;
  }>(
    `
    SELECT
      severity,
      COUNT(*) as count
    FROM incidents
    WHERE workspace_id = $1
    AND deleted_at IS NULL
    AND ($2 = true OR scope = 'global' OR (scope = 'team' AND team_id = $3))
    GROUP BY severity
    ORDER BY
      CASE severity
        WHEN 'critical' THEN 1
        WHEN 'high' THEN 2
        WHEN 'medium' THEN 3
        WHEN 'low' THEN 4
      END
    `,
    [workspaceId, isWorkspaceLevel, teamId],
  );

  const severityMap: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
  };

  res.forEach((row) => {
    severityMap[row.severity] = parseInt(row.count ?? "0");
  });

  return {
    critical: severityMap.critical ?? 0,
    high: severityMap.high ?? 0,
    medium: severityMap.medium ?? 0,
    low: severityMap.low ?? 0,
  };
}
