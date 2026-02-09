import { pool } from "../../config/db.js";
import type { OnboardingData } from "../validation/onboardingSchema.js";
import { v4 as uuidv4 } from "uuid";

export async function onboardingModel({
  data,
  userId,
}: {
  data: OnboardingData;
  userId: string;
}) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // create workspace
    const workspaceRes = await client.query<{ slug: string }>(
      `
        INSERT INTO workspaces(name, slug, description, owner_id, plan)
        VALUES ($1, '${uuidv4()}', $2, $3, $4)
        RETURNING slug
        `,
      [data.workspaceName, data.workspaceDescription, userId, data.plan],
    );

    const workspaceId = workspaceRes.rows[0]?.slug!;

    // create Team
    await client.query<{ id: string }>(
      `
        INSERT INTO teams(workspace_id, name, slug)
        VALUES($1, $2, '${uuidv4()}')
        RETURNING id
        `,
      [workspaceId, data.teamName],
    );

    // create member
    await client.query(
      `
        INSERT INTO members(user_id, workspace_id, invited_by, role)
        VALUES ($1, $2, $3, 'owner')
      `,
      [userId, workspaceId, userId],
    );

    // update user
    await client.query(
      `
        UPDATE users u
        SET timezone = $1, primary_workspace = $2
        WHERE u.id = $3
        `,
      [data.timezone, workspaceId, userId],
    );

    await client.query("COMMIT");
    return workspaceId;
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");
    return null;
  } finally {
    client.release();
  }
}
