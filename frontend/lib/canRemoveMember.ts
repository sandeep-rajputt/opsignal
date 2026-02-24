import { hasPermission, Permission } from "@/rbac/permissions";
import { ROLE, ROLE_HIERARCHY } from "@/rbac/roles";

/**
 * Determines if the current user can remove a target member based on role hierarchy.
 *
 * Rules:
 * 1. User must have REMOVE_WORKSPACE_MEMBER permission
 * 2. Cannot remove Owner role
 * 3. Can only remove members with lower role level (based on ROLE_HIERARCHY)
 *
 * @param currentUserRole - The role of the user attempting the removal
 * @param targetMemberRole - The role of the member to be removed
 * @returns true if removal is allowed, false otherwise
 */
export default function canRemoveMember(
  currentUserRole: ROLE | string,
  targetMemberRole: ROLE | string,
): boolean {
  // Check if user has base permission using existing RBAC
  const hasBasePermission = hasPermission({
    role: currentUserRole as ROLE,
    permission: Permission.REMOVE_WORKSPACE_MEMBER,
  });

  if (!hasBasePermission) {
    return false;
  }

  // Cannot remove Owner
  if (targetMemberRole === ROLE.OWNER || targetMemberRole === "owner") {
    return false;
  }

  // Use existing ROLE_HIERARCHY to compare role levels
  const currentRoleLevel = ROLE_HIERARCHY[currentUserRole as ROLE];
  const targetRoleLevel = ROLE_HIERARCHY[targetMemberRole as ROLE];

  // Can only remove members with lower role level
  return currentRoleLevel > targetRoleLevel;
}
