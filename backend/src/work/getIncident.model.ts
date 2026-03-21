import { query } from "../config/db.js";

export async function getIncidentByIdModel(incidentId: string) {
  const res = await query<{
    id: string;
    title: string;
    status: string;
    severity: string;
    description: string | null;
    scope: string;
    team_id: string | null;
    workspace_id: string;
    workspace_name: string;
    team_name: string | null;
    created_by_name: string;
    created_at: string;
    updated_at: string;
  }>(
    `
    SELECT
      i.id,
      i.title,
      i.status,
      i.severity,
      i.description,
      i.scope,
      i.team_id,
      i.workspace_id,
      w.name AS workspace_name,
      t.name AS team_name,
      u.name AS created_by_name,
      i.created_at,
      i.updated_at
    FROM incidents i
    JOIN workspaces w ON w.slug = i.workspace_id
    LEFT JOIN teams t ON t.id = i.team_id
    JOIN users u ON u.id = i.created_by
    WHERE i.id = $1
    AND i.deleted_at IS NULL
    `,
    [incidentId],
  );

  return res[0] ?? null;
}

export async function checkUserCanViewIncident({
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
