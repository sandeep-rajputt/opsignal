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

export async function getBasicFeedModel({
  workspaceId,
  teamId,
}: {
  workspaceId: string;
  teamId: string | null;
}) {
  const isWorkspaceLevel = teamId === null;

  const res = await query<{
    plan: string;
    total_members: string;
    total_incidents: string;
    critical_incidents: string;
    total_tasks: string;
    urgent_tasks: string;
    total_improvements: string;
  }>(
    `
    SELECT
      (
        SELECT plan
        FROM workspaces
        WHERE slug = $1
        AND deleted_at IS NULL
      ) AS plan,
      (
        SELECT COUNT(*)
        FROM members
        WHERE workspace_id = $1
        AND deleted_at IS NULL
        AND ($2 = true OR team_id = $3)
      ) AS total_members,
      (
        SELECT COUNT(*)
        FROM incidents
        WHERE workspace_id = $1
        AND deleted_at IS NULL
        AND status NOT IN ('resolved')
        AND ($2 = true OR scope = 'global' OR (scope = 'team' AND team_id = $3))
      ) AS total_incidents,
      (
        SELECT COUNT(*)
        FROM incidents
        WHERE workspace_id = $1
        AND deleted_at IS NULL
        AND status NOT IN ('resolved')
        AND severity = 'critical'
        AND ($2 = true OR scope = 'global' OR (scope = 'team' AND team_id = $3))
      ) AS critical_incidents,
      (
        SELECT COUNT(*)
        FROM tasks
        WHERE workspace_id = $1
        AND deleted_at IS NULL
        AND status NOT IN ('done', 'cancelled')
        AND ($2 = true OR scope = 'global' OR (scope = 'team' AND team_id = $3))
      ) AS total_tasks,
      (
        SELECT COUNT(*)
        FROM tasks
        WHERE workspace_id = $1
        AND deleted_at IS NULL
        AND status NOT IN ('done', 'cancelled')
        AND priority = 'urgent'
        AND ($2 = true OR scope = 'global' OR (scope = 'team' AND team_id = $3))
      ) AS urgent_tasks,
      (
        SELECT COUNT(*)
        FROM improvements
        WHERE workspace_id = $1
        AND deleted_at IS NULL
        AND status NOT IN ('done', 'rejected')
        AND ($2 = true OR scope = 'global' OR (scope = 'team' AND team_id = $3))
      ) AS total_improvements
    `,
    [workspaceId, isWorkspaceLevel, teamId],
  );

  const plan = res[0]?.plan ?? "free";
  const memberLimit = plan === "premium" ? null : 5;

  return {
    totalMembers: parseInt(res[0]?.total_members ?? "0"),
    memberLimit,
    incidents: {
      total: parseInt(res[0]?.total_incidents ?? "0"),
      critical: parseInt(res[0]?.critical_incidents ?? "0"),
    },
    tasks: {
      total: parseInt(res[0]?.total_tasks ?? "0"),
      urgent: parseInt(res[0]?.urgent_tasks ?? "0"),
    },
    improvements: {
      total: parseInt(res[0]?.total_improvements ?? "0"),
    },
  };
}
