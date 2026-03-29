import { query } from "../../config/db.js";

export async function getWorkspacePlanModel(
  workspaceId: string,
): Promise<"free" | "premium" | null> {
  const res = await query<{ plan: "free" | "premium" }>(
    `SELECT plan FROM workspaces WHERE slug = $1 AND deleted_at IS NULL`,
    [workspaceId],
  );

  return res[0]?.plan || null;
}
