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

export async function getOverviewModel({
  workspaceId,
  teamId,
}: {
  workspaceId: string;
  teamId: string | null;
}) {
  const isWorkspaceLevel = teamId === null;

  if (isWorkspaceLevel) {
    const res = await query<{
      workspace_name: string;
      plan: string;
      total_teams: string;
      total_members: string;
      total_incidents: string;
      total_tasks: string;
      total_improvements: string;
    }>(
      `
      SELECT
        (SELECT name FROM workspaces WHERE slug = $1 AND deleted_at IS NULL) AS workspace_name,
        (SELECT plan FROM workspaces WHERE slug = $1 AND deleted_at IS NULL) AS plan,
        (SELECT COUNT(*) FROM teams WHERE workspace_id = $1 AND deleted_at IS NULL) AS total_teams,
        (SELECT COUNT(*) FROM members WHERE workspace_id = $1 AND deleted_at IS NULL) AS total_members,
        (SELECT COUNT(*) FROM incidents WHERE workspace_id = $1 AND deleted_at IS NULL) AS total_incidents,
        (SELECT COUNT(*) FROM tasks WHERE workspace_id = $1 AND deleted_at IS NULL) AS total_tasks,
        (SELECT COUNT(*) FROM improvements WHERE workspace_id = $1 AND deleted_at IS NULL) AS total_improvements
      `,
      [workspaceId],
    );

    const plan = res[0]?.plan ?? "free";
    const memberLimit = plan === "premium" ? null : 5;

    return {
      name: res[0]?.workspace_name ?? "",
      plan,
      memberLimit,
      totalTeams: parseInt(res[0]?.total_teams ?? "0"),
      totalMembers: parseInt(res[0]?.total_members ?? "0"),
      totalIncidents: parseInt(res[0]?.total_incidents ?? "0"),
      totalTasks: parseInt(res[0]?.total_tasks ?? "0"),
      totalImprovements: parseInt(res[0]?.total_improvements ?? "0"),
    };
  } else {
    const res = await query<{
      team_name: string;
      plan: string;
      total_members: string;
      total_incidents: string;
      total_tasks: string;
      total_improvements: string;
    }>(
      `
      SELECT
        (SELECT name FROM teams WHERE id = $2 AND deleted_at IS NULL) AS team_name,
        (SELECT plan FROM workspaces WHERE slug = $1 AND deleted_at IS NULL) AS plan,
        (SELECT COUNT(*) FROM members WHERE workspace_id = $1 AND team_id = $2 AND deleted_at IS NULL) AS total_members,
        (SELECT COUNT(*) FROM incidents WHERE workspace_id = $1 AND team_id = $2 AND deleted_at IS NULL) AS total_incidents,
        (SELECT COUNT(*) FROM tasks WHERE workspace_id = $1 AND team_id = $2 AND deleted_at IS NULL) AS total_tasks,
        (SELECT COUNT(*) FROM improvements WHERE workspace_id = $1 AND team_id = $2 AND deleted_at IS NULL) AS total_improvements
      `,
      [workspaceId, teamId],
    );

    const plan = res[0]?.plan ?? "free";
    const memberLimit = plan === "premium" ? null : 5;

    return {
      name: res[0]?.team_name ?? "",
      plan,
      memberLimit,
      totalTeams: null,
      totalMembers: parseInt(res[0]?.total_members ?? "0"),
      totalIncidents: parseInt(res[0]?.total_incidents ?? "0"),
      totalTasks: parseInt(res[0]?.total_tasks ?? "0"),
      totalImprovements: parseInt(res[0]?.total_improvements ?? "0"),
    };
  }
}
