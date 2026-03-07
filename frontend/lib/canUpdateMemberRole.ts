import { hasPermission, Permission } from "@/rbac/permissions";
import { ROLE, ROLE_HIERARCHY } from "@/rbac/roles";

/**
 * Determines if the current user can update a target member's role based on role hierarchy.
 *
 * Rules:
 * 1. User must have UPDATE_MEMBER_ROLE permission (OWNER or ADMIN)
 * 2. Cannot change Owner role
 * 3. ADMIN cannot change role of other ADMINs
 * 4. ADMIN can only change role of MODERATOR and MEMBER
 * 5. Cannot change your own role
 *
 * @param currentUserRole - The role of the user attempting the update
 * @param targetMemberRole - The role of the member to be updated
 * @param currentUserId - The ID of the current user (optional, for self-check)
 * @param targetMemberId - The ID of the target member (optional, for self-check)
 * @returns true if role update is allowed, false otherwise
 */
export default function canUpdateMemberRole(
  currentUserRole: ROLE | string,
  targetMemberRole: ROLE | string,
  currentUserId?: string,
  targetMemberId?: string,
): boolean {
  // Check if user has base permission using existing RBAC
  const hasBasePermission = hasPermission({
    role: currentUserRole as ROLE,
    permission: Permission.UPDATE_MEMBER_ROLE,
  });

  if (!hasBasePermission) {
    return false;
  }

  // Cannot change your own role
  if (currentUserId && targetMemberId && currentUserId === targetMemberId) {
    return false;
  }

  // Cannot change Owner role
  if (targetMemberRole === ROLE.OWNER || targetMemberRole === "owner") {
    return false;
  }

  // ADMIN-specific restrictions
  if (currentUserRole === ROLE.ADMIN || currentUserRole === "admin") {
    // ADMIN cannot change role of other ADMINs
    if (targetMemberRole === ROLE.ADMIN || targetMemberRole === "admin") {
      return false;
    }

    // ADMIN can only change role of MODERATOR and MEMBER
    const isModeratorOrMember =
      targetMemberRole === ROLE.MODERATOR ||
      targetMemberRole === "moderator" ||
      targetMemberRole === ROLE.MEMBER ||
      targetMemberRole === "member";

    return isModeratorOrMember;
  }

  // OWNER can change anyone's role (except Owner itself, already checked above)
  return true;
}

/**
 * Gets the available roles that a user can assign to a target member.
 *
 * @param currentUserRole - The role of the user attempting the update
 * @param targetMemberRole - The current role of the target member
 * @returns Array of roles that can be assigned
 */
export function getAvailableRoles(
  currentUserRole: ROLE | string,
  targetMemberRole: ROLE | string,
): ROLE[] {
  // If user cannot update this member's role, return empty array
  if (!canUpdateMemberRole(currentUserRole, targetMemberRole)) {
    return [];
  }

  // OWNER can assign any role except OWNER
  if (currentUserRole === ROLE.OWNER || currentUserRole === "owner") {
    return [ROLE.ADMIN, ROLE.MODERATOR, ROLE.MEMBER];
  }

  // ADMIN can only assign MODERATOR and MEMBER roles
  if (currentUserRole === ROLE.ADMIN || currentUserRole === "admin") {
    return [ROLE.MODERATOR, ROLE.MEMBER];
  }

  return [];
}
