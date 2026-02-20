import { query } from "../../config/db.js";

interface UserTeam {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatar_url: string | null;
}

export async function getUserTeamModel(
  userId: string,
  workspaceId: string,
): Promise<UserTeam | null> {
  const teams = await query<UserTeam>(
    `SELECT 
      t.id,
      t.name,
      t.slug,
      t.description,
      t.avatar_url
    FROM teams t
    INNER JOIN members m ON m.team_id = t.id
    WHERE m.user_id = $1
      AND m.workspace_id = $2
      AND m.deleted_at IS NULL
      AND t.deleted_at IS NULL
    LIMIT 1`,
    [userId, workspaceId],
  );

  return teams[0] || null;
}
