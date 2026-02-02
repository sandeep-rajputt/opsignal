import { query } from "../../config/db.js";

export async function getUserPrimaryWorkspaceModel(userId: string) {
  const res = await query<{ primaryworkspace: string }>(
    `
    SELECT u.primary_workspace AS primaryworkspace
    FROM users u
    WHERE u.id = $1
    `,
    [userId],
  );
  return res[0]?.primaryworkspace;
}
