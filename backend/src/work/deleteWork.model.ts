import { query } from "../config/db.js";

export async function getIncidentOwnerModel(incidentId: string) {
  const res = await query<{
    created_by: string;
    team_id: string | null;
    workspace_id: string;
  }>(
    `SELECT created_by, team_id, workspace_id FROM incidents WHERE id = $1 AND deleted_at IS NULL`,
    [incidentId],
  );
  return res[0] ?? null;
}

export async function getTaskOwnerModel(taskId: string) {
  const res = await query<{
    created_by: string;
    team_id: string | null;
    workspace_id: string;
  }>(
    `SELECT created_by, team_id, workspace_id FROM tasks WHERE id = $1 AND deleted_at IS NULL`,
    [taskId],
  );
  return res[0] ?? null;
}

export async function getImprovementOwnerModel(improvementId: string) {
  const res = await query<{
    created_by: string;
    team_id: string | null;
    workspace_id: string;
  }>(
    `SELECT created_by, team_id, workspace_id FROM improvements WHERE id = $1 AND deleted_at IS NULL`,
    [improvementId],
  );
  return res[0] ?? null;
}

export async function softDeleteIncidentModel(incidentId: string) {
  const res = await query<{ id: string }>(
    `UPDATE incidents SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
    [incidentId],
  );
  return res[0]?.id ?? null;
}

export async function softDeleteTaskModel(taskId: string) {
  const res = await query<{ id: string }>(
    `UPDATE tasks SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
    [taskId],
  );
  return res[0]?.id ?? null;
}

export async function softDeleteImprovementModel(improvementId: string) {
  const res = await query<{ id: string }>(
    `UPDATE improvements SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING id`,
    [improvementId],
  );
  return res[0]?.id ?? null;
}
