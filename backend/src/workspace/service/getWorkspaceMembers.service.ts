import getWorkspaceMembersModel from "../model/getWorkspaceMembers.model.js";
import type { ROLE } from "../../rbac/roles.js";

export async function getWorkspaceMembersService({
  workspaceId,
  role = null,
  team = null,
  page = 1,
  limit = 10,
}: {
  workspaceId: string;
  role?: ROLE | null;
  team?: string | null;
  page?: number;
  limit?: number;
}) {
  const result = await getWorkspaceMembersModel({
    workspaceId,
    role,
    team,
    page,
    limit,
  });

  return result;
}
