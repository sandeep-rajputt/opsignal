import { ROLE } from "@/rbac/roles";

export enum Permission {
  DELETE_WORKSPACE = "delete_workspace",
  EDIT_WORKSPACE = "edit_workspace",
  ADD_WORKSPACE_MEMBER = "Add_workspace_member",
  ADD_TEAM_MEMBER = "add_team_member",
  SEE_WORKSPACE_MEMBERS = "see_workspace_members",
  REMOVE_WORKSPACE_MEMBER = "remove_workspace_member",
  UPDATE_MEMBER_ROLE = "update_member_role",
  REMOVE_TEAM_MEMBER = "remove_team_member",
  SEE_TEAM_MEMBERS = "see_team_members",
  VIEW_ALL_WORKSPACE = "view_all_workspacre",
  CREATE_WORKSPACE_WORK = "create_workspace_work",
  CREATE_TEAM_WORK = "create_team_work",
  DELETE_WORK = "delete_work",
  CHANGE_WORKSPACE_WORK_STATUS = "change_workspace_work_status",
  CHANGE_TEAM_WORK_STATUS = "change_team_work_status",
  CHANGE_WORKSPACE_WORK_SEVERITY = "change_workspace_work_severity",
  CHANGE_TEAM_WORK_SEVERITY = "change_team_work_severity",
}

export const RESTRICTED_PERMISSIONS: Record<Permission, ROLE[]> = {
  [Permission.DELETE_WORKSPACE]: [ROLE.OWNER],
  [Permission.EDIT_WORKSPACE]: [ROLE.OWNER, ROLE.ADMIN],
  [Permission.ADD_WORKSPACE_MEMBER]: [ROLE.OWNER, ROLE.ADMIN],
  [Permission.ADD_TEAM_MEMBER]: [ROLE.MODERATOR],
  [Permission.SEE_WORKSPACE_MEMBERS]: [ROLE.OWNER, ROLE.ADMIN],
  [Permission.REMOVE_WORKSPACE_MEMBER]: [ROLE.OWNER, ROLE.ADMIN],
  [Permission.UPDATE_MEMBER_ROLE]: [ROLE.OWNER, ROLE.ADMIN],
  [Permission.REMOVE_TEAM_MEMBER]: [ROLE.OWNER, ROLE.ADMIN, ROLE.MODERATOR],
  [Permission.SEE_TEAM_MEMBERS]: [ROLE.OWNER, ROLE.ADMIN, ROLE.MODERATOR],
  [Permission.VIEW_ALL_WORKSPACE]: [ROLE.OWNER, ROLE.ADMIN],
  [Permission.CREATE_WORKSPACE_WORK]: [ROLE.OWNER, ROLE.ADMIN],
  [Permission.CREATE_TEAM_WORK]: [ROLE.MEMBER, ROLE.MODERATOR],
  [Permission.DELETE_WORK]: [ROLE.ADMIN, ROLE.OWNER, ROLE.MODERATOR],
  [Permission.CHANGE_WORKSPACE_WORK_STATUS]: [ROLE.OWNER, ROLE.ADMIN],
  [Permission.CHANGE_TEAM_WORK_STATUS]: [
    ROLE.OWNER,
    ROLE.ADMIN,
    ROLE.MODERATOR,
    ROLE.MEMBER,
  ],
  [Permission.CHANGE_WORKSPACE_WORK_SEVERITY]: [ROLE.OWNER, ROLE.ADMIN],
  [Permission.CHANGE_TEAM_WORK_SEVERITY]: [
    ROLE.OWNER,
    ROLE.ADMIN,
    ROLE.MODERATOR,
  ],
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
