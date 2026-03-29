import { pool } from "../../config/db.js";

export async function updateWorkspaceSettingsModel({
  workspaceId,
  name,
  description,
  logoUrl,
  logoPublicId,
  slug,
}: {
  workspaceId: string;
  name?: string | undefined;
  description?: string | null | undefined;
  logoUrl?: string | undefined;
  logoPublicId?: string | undefined;
  slug?: string | undefined;
}): Promise<{
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  slug: string;
} | null> {
  const client = await pool.connect();

  try {
    const updates: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }

    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }

    if (logoUrl !== undefined) {
      updates.push(`logo_url = $${paramIndex++}`);
      values.push(logoUrl);
    }

    if (slug !== undefined) {
      updates.push(`slug = $${paramIndex++}`);
      values.push(slug);
    }

    if (updates.length === 0) {
      return null;
    }

    updates.push(`updated_at = NOW()`);
    values.push(workspaceId);

    const result = await client.query(
      `
      UPDATE workspaces
      SET ${updates.join(", ")}
      WHERE slug = $${paramIndex} AND deleted_at IS NULL
      RETURNING slug AS id, name, description, logo_url, slug
      `,
      values,
    );

    return result.rows[0] || null;
  } finally {
    client.release();
  }
}
