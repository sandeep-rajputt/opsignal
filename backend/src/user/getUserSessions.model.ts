import { query } from "../config/db.js";

export async function getUserSessionsModel(userId: string) {
  const res = await query<{
    id: string;
    ip_address: string | null;
    location: string | null;
    device: string | null;
    created_at: string;
    updated_at: string;
    expires_at: string;
  }>(
    `
    SELECT 
      id,
      ip_address,
      location,
      device,
      created_at,
      updated_at,
      expires_at
    FROM sessions
    WHERE user_id = $1
    AND expires_at > NOW()
    ORDER BY updated_at DESC
    `,
    [userId],
  );

  return res;
}
