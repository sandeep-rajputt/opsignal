import { checkPermission } from "../../rbac/rbac.service.js";
import { Permission } from "../../rbac/permissions.js";
import { ROLE, ROLE_HIERARCHY } from "../../rbac/roles.js";
import updateMemberRoleModel from "../model/updateMemberRole.model.js";
import getMemberRoleModel from "../model/getMemberRole.model.js";
import redisClient from "../../config/redis.js";

/**
 * Service for updating workspace member roles with strict role-based permissions
 * Rules:
 * 1. Only OWNER can change role of anyone
 * 2. ADMIN cannot change role of each other
 * 3. ADMIN can only change role of MODERATOR and MEMBER
 * 4. MEMBER and MODERATOR do not have access to change role of anyone
 */
export async function updateMemberRoleService({
  workspaceId,
  requestingUserId,
  targetMemberId,
  newRole,
}: {
  workspaceId: string;
  requestingUserId: string;
  targetMemberId: string;
  newRole: ROLE;
}): Promise<{ success: boolean; message: string }> {
  // Check if requesting user has base permission to manage members
  const canManageMembers = await checkPermission({
    userId: requestingUserId,
    workspaceId,
    permission: Permission.UPDATE_MEMBER_ROLE,
  });

  if (!canManageMembers) {
    throw new Error("Insufficient permissions to update member roles");
  }

  // Get roles for both users
  const requestingUserRole = await getMemberRoleModel({
    userId: requestingUserId,
    workspaceId,
  });

  const targetMemberRole = await getMemberRoleModel({
    userId: targetMemberId,
    workspaceId,
  });

  if (!targetMemberRole) {
    throw new Error("Member not found");
  }

  // Rule 1: Cannot change your own role
  if (requestingUserId === targetMemberId) {
    throw new Error("Cannot change your own role");
  }

  // Rule 2: Cannot change Owner role
  if (targetMemberRole === ROLE.OWNER) {
    throw new Error("Cannot change workspace owner role");
  }

  // Rule 3: Cannot promote to Owner
  if (newRole === ROLE.OWNER) {
    throw new Error("Cannot promote member to owner");
  }

  // Rule 4: No change needed
  if (targetMemberRole === newRole) {
    throw new Error("Member already has this role");
  }

  // Rule 5: ADMIN-specific restrictions
  if (requestingUserRole === ROLE.ADMIN) {
    // ADMIN cannot change role of other ADMINs
    if (targetMemberRole === ROLE.ADMIN) {
      throw new Error("Admin cannot change role of other admins");
    }

    // ADMIN can only change role of MODERATOR and MEMBER
    if (
      targetMemberRole !== ROLE.MODERATOR &&
      targetMemberRole !== ROLE.MEMBER
    ) {
      throw new Error("Admin can only change role of moderators and members");
    }

    // ADMIN cannot promote to ADMIN
    if (newRole === ROLE.ADMIN) {
      throw new Error("Admin cannot promote members to admin role");
    }
  }

  // Rule 6: Only OWNER and ADMIN can change roles (enforced by permission check above)
  // MEMBER and MODERATOR will fail the permission check

  // Perform the role update
  const result = await updateMemberRoleModel({
    memberId: targetMemberId,
    workspaceId,
    newRole,
  });

  if (!result.success) {
    throw new Error("Failed to update member role");
  }

  // Invalidate Redis cache for the target member's role
  await redisClient.del(
    `users:${targetMemberId}:workspaces:${workspaceId}:role`,
  );

  return {
    success: true,
    message: "Member role updated successfully",
  };
}
