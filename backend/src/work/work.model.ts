import { query } from "../config/db.js";

export async function getUserTeamModel({
  userId,
  workspaceId,
}: {
  userId: string;
  workspaceId: string;
}) {
  const res = await query<{ team_id: string | null }>(
    `
    SELECT team_id
    FROM members
    WHERE user_id = $1 AND workspace_id = $2 AND deleted_at IS NULL
    `,
    [userId, workspaceId],
  );

  return res[0]?.team_id ?? null;
}

export async function createIncidentModel({
  workspaceId,
  teamId,
  scope,
  createdBy,
  title,
  severity,
  description,
}: {
  workspaceId: string;
  teamId: string | null;
  scope: "global" | "team";
  createdBy: string;
  title: string;
  severity: string;
  description?: string;
}) {
  const res = await query<{ id: string }>(
    `
    INSERT INTO incidents (workspace_id, team_id, scope, created_by, title, severity, description)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
    `,
    [
      workspaceId,
      teamId,
      scope,
      createdBy,
      title,
      severity,
      description ?? null,
    ],
  );

  return res[0]?.id ?? null;
}

export async function createTaskModel({
  workspaceId,
  teamId,
  scope,
  createdBy,
  title,
  priority,
  description,
  dueDate,
}: {
  workspaceId: string;
  teamId: string | null;
  scope: "global" | "team";
  createdBy: string;
  title: string;
  priority: string;
  description?: string;
  dueDate?: string;
}) {
  const res = await query<{ id: string }>(
    `
    INSERT INTO tasks (workspace_id, team_id, scope, created_by, title, priority, description, due_date)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id
    `,
    [
      workspaceId,
      teamId,
      scope,
      createdBy,
      title,
      priority,
      description ?? null,
      dueDate ?? null,
    ],
  );

  return res[0]?.id ?? null;
}

export async function createImprovementModel({
  workspaceId,
  teamId,
  scope,
  createdBy,
  title,
  category,
  description,
  expectedImpact,
}: {
  workspaceId: string;
  teamId: string | null;
  scope: "global" | "team";
  createdBy: string;
  title: string;
  category: string;
  description?: string;
  expectedImpact?: string;
}) {
  const res = await query<{ id: string }>(
    `
    INSERT INTO improvements (workspace_id, team_id, scope, created_by, title, category, description, expected_impact)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING id
    `,
    [
      workspaceId,
      teamId,
      scope,
      createdBy,
      title,
      category,
      description ?? null,
      expectedImpact ?? null,
    ],
  );

  return res[0]?.id ?? null;
}
