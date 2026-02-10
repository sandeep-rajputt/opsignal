import { updateUserPassword, getUserModel } from "./users.model.js";
import { hashCompare, createHash } from "../utils/hash.js";

export async function changePasswordUsingPasswordService({
  userId,
  currentPassword,
  newPassword,
}: {
  userId: string;
  currentPassword: string;
  newPassword: string;
}) {
  const user = await getUserModel(userId);

  if (!user) {
    return { success: false, message: "User not found" };
  }

  // Need to get password hash - let me create a new model function
  const userWithPassword = await getUserWithPasswordById(userId);

  if (!userWithPassword || !userWithPassword.passwordhash) {
    return { success: false, message: "User not found" };
  }

  const isMatch = await hashCompare(
    currentPassword,
    userWithPassword.passwordhash,
  );

  if (!isMatch) {
    return { success: false, message: "Current password is incorrect" };
  }

  const hashedPassword = await createHash(newPassword);
  await updateUserPassword(userId, hashedPassword);

  return { success: true, message: "Password changed successfully" };
}

async function getUserWithPasswordById(userId: string) {
  const { query } = await import("../config/db.js");
  const res = await query<{ id: string; passwordhash: string }>(
    `
    SELECT u.id, u.password_hash AS passwordhash
    FROM users u
    WHERE u.id = $1
    AND u.deleted_at IS NULL
    `,
    [userId],
  );

  return res[0];
}
