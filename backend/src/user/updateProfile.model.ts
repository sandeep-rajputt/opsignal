import { pool } from "../config/db.js";

export async function updateProfileModel(
  userId: string,
  name: string,
  avatarUrl?: string,
  avatarPublicId?: string,
) {
  const query = `
    UPDATE users
    SET name = $1, avatar_url = $2, avatar_public_id = $3, updated_at = NOW()
    WHERE id = $4
    RETURNING id, name, avatar_url AS avatarurl, avatar_public_id
  `;

  const result = await pool.query(query, [
    name,
    avatarUrl || null,
    avatarPublicId || null,
    userId,
  ]);

  return result.rows[0];
}
