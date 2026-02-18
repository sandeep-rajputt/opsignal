import { query } from "../../config/db.js";

interface Team {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatar_url: string | null;
  created_at: Date;
}

export async function getWorkspaceTeamsModel(
  workspaceId: string,
): Promise<Team[]> {
  const teams = await query<Team>(
    `SELECT 
      id,
      name,
      slug,
      description,
      avatar_url,
      created_at
    FROM teams
    WHERE workspace_id = $1
      AND deleted_at IS NULL
    ORDER BY created_at ASC`,
    [workspaceId],
  );

  return teams;
}
