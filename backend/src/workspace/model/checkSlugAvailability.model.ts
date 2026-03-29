import { query } from "../../config/db.js";

export async function checkSlugAvailabilityModel(
  slug: string,
  currentWorkspaceId: string,
): Promise<boolean> {
  const res = await query<{ exists: boolean }>(
    `SELECT EXISTS(
      SELECT 1 FROM workspaces 
      WHERE slug = $1 AND slug != $2 AND deleted_at IS NULL
    ) AS exists`,
    [slug, currentWorkspaceId],
  );

  return !res[0]?.exists;
}
