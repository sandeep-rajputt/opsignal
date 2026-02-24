import getMembersModel from "../model/getMembers.model.js";
import { checkPermission } from "../../rbac/rbac.service.js";
import { Permission } from "../../rbac/permissions.js";
import getUserTeamsModel from "../model/getUserTeams.model.js";

/**
 * Service for getting workspace members with role-based visibility
 * Owners/Admins see all members, Moderators/Members see only their team members
 */
export async function getMembersService({
  workspaceId,
  userId,
  page = 1,
  limit = 10,
}: {
  workspaceId: string;
  userId: string;
  page?: number;
  limit?: number;
}) {
  // Check if user has permission to see all workspace members
  const canSeeAllMembers = await checkPermission({
    userId,
    workspaceId,
    permission: Permission.SEE_WORKSPACE_MEMBERS,
  });

  let teamIds: string[] | null = null;

  if (!canSeeAllMembers) {
    // User can only see members from their teams
    teamIds = await getUserTeamsModel({ userId, workspaceId });
  }

  // Fetch members with appropriate filters
  const result = await getMembersModel({
    workspaceId,
    teamIds,
    page,
    limit,
  });

  return result;
}
