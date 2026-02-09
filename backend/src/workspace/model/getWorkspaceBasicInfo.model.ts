import { query } from "../../config/db.js";
import type { ROLE } from "../../rbac/roles.js";

export async function getWorkspaceBasicInfoModel(
  workspaceId: string,
  userId: string,
) {
  const res = await query<{
    id: string;
    name: string;
    description: string | null;
    logo_url: string | null;
    role: ROLE | null;
  }>(
    `SELECT 
      w.slug AS id,
      w.name,
      w.description,
      w.logo_url,
      m.role
    FROM workspaces w
    LEFT JOIN members m ON m.workspace_id = w.slug AND m.user_id = $2 AND m.deleted_at IS NULL
    WHERE w.slug = $1 AND w.deleted_at IS NULL`,
    [workspaceId, userId],
  );
  return res[0] || null;
}
