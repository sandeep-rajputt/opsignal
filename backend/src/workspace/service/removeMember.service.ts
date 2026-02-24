import { checkPermission } from "../../rbac/rbac.service.js";
import { Permission } from "../../rbac/permissions.js";
import { ROLE, ROLE_HIERARCHY } from "../../rbac/roles.js";
import removeMemberModel from "../model/removeMember.model.js";
import getMemberRoleModel from "../model/getMemberRole.model.js";

/**
 * Service for removing workspace members with role-based permissions
 * Validates removal permissions based on role hierarchy
 */
export async function removeMemberService({
  workspaceId,
  requestingUserId,
  targetMemberId,
}: {
  workspaceId: string;
  requestingUserId: string;
  targetMemberId: string;
}): Promise<{ success: boolean; message: string }> {
  // Check if requesting user has base permission to remove members
  const canRemoveMembers = await checkPermission({
    userId: requestingUserId,
    workspaceId,
    permission: Permission.REMOVE_WORKSPACE_MEMBER,
  });

  if (!canRemoveMembers) {
    throw new Error("Insufficient permissions to remove members");
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

  // Rule 1: Cannot remove Owner
  if (targetMemberRole === ROLE.OWNER) {
    throw new Error("Cannot remove workspace owner");
  }

  // Rule 2: Can only remove members with lower role level
  const requestingRoleLevel = ROLE_HIERARCHY[requestingUserRole as ROLE];
  const targetRoleLevel = ROLE_HIERARCHY[targetMemberRole as ROLE];

  if (targetRoleLevel >= requestingRoleLevel) {
    throw new Error("Insufficient permissions to remove this member");
  }

  // Rule 3: Cannot remove yourself
  if (requestingUserId === targetMemberId) {
    throw new Error("Cannot remove yourself");
  }

  // Perform the removal
  const result = await removeMemberModel({
    memberId: targetMemberId,
    workspaceId,
  });

  if (!result.success) {
    throw new Error("Failed to remove member");
  }

  return {
    success: true,
    message: "Member removed successfully",
  };
}
