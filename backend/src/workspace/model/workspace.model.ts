import { query } from "../../config/db.js";

export async function getAllWorkspaceModel(userId: string) {
  const res = await query<{
    id: string;
    name: string;
    image: string;
    role: string;
  }>(
    `SELECT 
      w.slug AS id,
      w.name,
      w.logo_url AS image,
      m.role
   FROM members m
   JOIN workspaces w ON w.slug = m.workspace_id
   WHERE m.user_id = $1
   ORDER BY m.joined_at ASC`,
    [userId],
  );

  return res;
}
