import { query } from "../config/db.js";
import type { Timezone } from "../workspace/validation/timezoneSchema.js";
import type {
  CreateUserQueryIncommingData,
  CreateUserQueryOutgoingData,
  CheckUserQueryResponse,
  CreateUserSession,
} from "./user.types.js";

export async function createUser(data: CreateUserQueryIncommingData) {
  const res = await query<CreateUserQueryOutgoingData>(
    `INSERT INTO users(name, email, password_hash) 
     VALUES ($1, $2, $3)

     RETURNING id
     `,
    [data.name, data.email, data.hashPassword],
  );
  return res[0];
}

export async function checkUser(data: string) {
  const res = await query<CheckUserQueryResponse>(
    `
    SELECT u.email, u.password_hash AS passwordhash, u.id, u.email_verified AS emailverified, u.primary_workspace AS workspaceId, u.timezone, u.name, u.avatar_url AS avatarurl
    FROM users u
    WHERE u.email = $1
    AND u.deleted_at IS NULL
    `,
    [data],
  );

  return res[0];
}

export async function verifyUser(id: string) {
  await query(
    `
    UPDATE users
    SET email_verified = true
    WHERE id = $1
    `,
    [id],
  );
  return;
}

export async function createUserSession({
  userId,
  ipAddress,
  device,
}: CreateUserSession) {
  const res = await query<{ id: string }>(
    `
    INSERT INTO sessions(user_id, ip_address, device, expires_at)
    VALUES ($1, $2, $3, NOW() + INTERVAL '7 days')

    RETURNING id
    `,
    [userId, ipAddress, device],
  );
  return res[0]!;
}

export async function getUserIdByEmail(email: string) {
  const res = await query<{ id: string }>(
    `
    SELECT u.id
    FROM users u
    WHERE u.email = $1
    AND u.deleted_at IS NULL
    `,
    [email],
  );

  return res[0];
}

export async function checkUserExistById(id: string) {
  const res = await query<{ exists: boolean }>(
    `
    SELECT EXISTS (
      SELECT 1
      FROM users
      WHERE id = $1
    );
    `,
    [id],
  );

  return res[0]?.exists;
}

export async function updateUserPassword(id: string, hashedPassword: string) {
  await query(
    `
    UPDATE users
    SET password_hash = $1
    WHERE id = $2
    `,
    [hashedPassword, id],
  );
  return;
}

export async function getUserModel(userId: string) {
  const res = await query<{
    id: string;
    name: string;
    email: string;
    timezone: Timezone;
    workspace: string;
    avatarurl: string | null;
  }>(
    `
    SELECT u.id, u.name, u.email, u.timezone, u.primary_workspace AS workspace, u.avatar_url AS avatarurl
    FROM users u
    WHERE u.id = $1
    `,
    [userId],
  );

  return res[0];
}
