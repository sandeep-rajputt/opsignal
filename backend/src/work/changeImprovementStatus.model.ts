import { pool, query } from "../config/db.js";

export async function getImprovementForStatusChangeModel(
  improvementId: string,
) {
  const res = await query<{
    id: string;
    status: string;
    scope: string;
    team_id: string | null;
    workspace_id: string;
    created_by: string;
  }>(
    `
    SELECT id, status, scope, team_id, workspace_id, created_by
    FROM improvements
    WHERE id = $1 AND deleted_at IS NULL
    `,
    [improvementId],
  );

  return res[0] ?? null;
}

export async function changeImprovementStatusModel({
  improvementId,
  status,
  actorId,
  workspaceId,
  fromStatus,
}: {
  improvementId: string;
  status: string;
  actorId: string;
  workspaceId: string;
  fromStatus: string;
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const improvementRes = await client.query<{ id: string }>(
      `
      UPDATE improvements
      SET status = $1, updated_at = NOW()
      WHERE id = $2 AND deleted_at IS NULL
      RETURNING id
      `,
      [status, improvementId],
    );

    if (!improvementRes.rows[0]?.id) {
      await client.query("ROLLBACK");
      return null;
    }

    const logRes = await client.query<{ id: string }>(
      `
      INSERT INTO work_logs (work_type, work_id, workspace_id, log_type, actor_id)
      VALUES ('improvement', $1, $2, 'status_change', $3)
      RETURNING id
      `,
      [improvementId, workspaceId, actorId],
    );

    const logId = logRes.rows[0]?.id;

    if (!logId) {
      await client.query("ROLLBACK");
      return null;
    }

    await client.query(
      `
      INSERT INTO improvement_status_logs (log_id, log_type, from_value, to_value)
      VALUES ($1, 'status_change', $2, $3)
      `,
      [logId, fromStatus, status],
    );

    await client.query("COMMIT");

    return improvementRes.rows[0].id;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
