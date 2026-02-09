import redisClient from "../config/redis.js";
import { hasPermission, Permission } from "./permissions.js";
import { getUserRoleModel } from "./rbac.model.js";
import { ROLE } from "./roles.js";

export async function checkPermission({
  userId,
  workspaceId,
  permission,
}: {
  userId: string;
  workspaceId: string;
  permission: Permission;
}): Promise<boolean> {
  const role = await getUserRole(userId, workspaceId);
  if (!role) {
    return false;
  }

  return hasPermission({ role, permission });
}

export async function getUserRole(
  userId: string,
  workspaceId: string,
): Promise<ROLE | null> {
  try {
    const redisRole = await redisClient.get(
      `users:${userId}:workspaces:${workspaceId}:role`,
    );

    if (redisRole && Object.values(ROLE).includes(redisRole as ROLE)) {
      return redisRole as ROLE;
    }

    const role = await getUserRoleModel({ userId, workspaceId });

    if (role && Object.values(ROLE).includes(role as ROLE)) {
      await redisClient.set(
        `users:${userId}:workspaces:${workspaceId}:role`,
        role,
        "EX",
        300,
      );
      return role as ROLE;
    }

    return null;
  } catch {
    return null;
  }
}
