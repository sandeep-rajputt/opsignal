import { pool, query } from "../config/db.js";

export async function getTaskForStatusChangeModel(taskId: string) {
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
    FROM tasks
    WHERE id = $1 AND deleted_at IS NULL
    `,
    [taskId],
  );

  return res[0] ?? null;
}

export async function changeTaskStatusModel({
  taskId,
  status,
  actorId,
  workspaceId,
  fromStatus,
}: {
  taskId: string;
  status: string;
  actorId: string;
  workspaceId: string;
  fromStatus: string;
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const taskRes = await client.query<{ id: string }>(
      `
      UPDATE tasks
      SET status = $1, updated_at = NOW()
      WHERE id = $2 AND deleted_at IS NULL
      RETURNING id
      `,
      [status, taskId],
    );

    if (!taskRes.rows[0]?.id) {
      await client.query("ROLLBACK");
      return null;
    }

    const logRes = await client.query<{ id: string }>(
      `
      INSERT INTO work_logs (work_type, work_id, workspace_id, log_type, actor_id)
      VALUES ('task', $1, $2, 'status_change', $3)
      RETURNING id
      `,
      [taskId, workspaceId, actorId],
    );

    const logId = logRes.rows[0]?.id;

    if (!logId) {
      await client.query("ROLLBACK");
      return null;
    }

    await client.query(
      `
      INSERT INTO task_status_logs (log_id, log_type, from_value, to_value)
      VALUES ($1, 'status_change', $2, $3)
      `,
      [logId, fromStatus, status],
    );

    await client.query("COMMIT");

    return taskRes.rows[0].id;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
