import { ROLE } from "./roles.js";

export enum Permission {
  DELETE_WORKSPACE = "delete_workspace",
  EDIT_WORKSPACE = "edit_workspace",
  ADD_WORKSPACE_MEMBER = "Add_workspace_member",
  ADD_TEAM_MEMBER = "add_team_member",
  SEE_WORKSPACE_MEMBERS = "see_workspace_members",
  REMOVE_WORKSPACE_MEMBER = "remove_workspace_member",
  REMOVE_TEAM_MEMBER = "remove_team_member",
  SEE_TEAM_MEMBERS = "see_team_members",
  VIEW_ALL_WORKSPACE = "view_all_workspacre",
}

export const RESTRICTED_PERMISSIONS: Record<Permission, ROLE[]> = {
  [Permission.DELETE_WORKSPACE]: [ROLE.OWNER],
  [Permission.EDIT_WORKSPACE]: [ROLE.OWNER, ROLE.ADMIN],
  [Permission.ADD_WORKSPACE_MEMBER]: [ROLE.OWNER, ROLE.ADMIN],
  [Permission.ADD_TEAM_MEMBER]: [ROLE.MODERATOR],
  [Permission.SEE_WORKSPACE_MEMBERS]: [ROLE.OWNER, ROLE.ADMIN],
  [Permission.REMOVE_WORKSPACE_MEMBER]: [ROLE.OWNER, ROLE.ADMIN],
  [Permission.REMOVE_TEAM_MEMBER]: [ROLE.OWNER, ROLE.ADMIN, ROLE.MODERATOR],
  [Permission.SEE_TEAM_MEMBERS]: [ROLE.OWNER, ROLE.ADMIN, ROLE.MODERATOR],
  [Permission.VIEW_ALL_WORKSPACE]: [ROLE.OWNER, ROLE.ADMIN],
};

export function hasPermission({
  role,
  permission,
}: {
  role: ROLE;
  permission: Permission;
}): boolean {
  const requiredRoles = RESTRICTED_PERMISSIONS[permission];

  if (!requiredRoles) {
    return true;
  }

  if (requiredRoles.includes(role)) {
    return true;
  }
  return false;
}
