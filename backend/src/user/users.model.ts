import { query } from "../config/db.js";
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
    SELECT u.email, u.password_hash AS passwordhash, u.id
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
  token,
}: CreateUserSession) {
  const res = await query<{ id: string }>(
    `
    INSERT INTO sessions(user_id, ip_address, device,refresh_token, expires_at)
    VALUES ($1, $2, $3,$4, NOW() + INTERVAL '7 days')
    `,
    [userId, ipAddress, device, token],
  );
  return;
}
