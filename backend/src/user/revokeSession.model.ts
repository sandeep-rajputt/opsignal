import { query } from "../config/db.js";

export async function revokeSessionModel(sessionId: string, userId: string) {
  const res = await query<{ id: string }>(
    `
    DELETE FROM sessions
    WHERE id = $1 AND user_id = $2
    RETURNING id
    `,
    [sessionId, userId],
  );

  return res[0];
}
