import { checkPermission } from "../../rbac/rbac.service.js";
import { Permission } from "../../rbac/permissions.js";
import { updateWorkspaceSettingsModel } from "../model/updateWorkspaceSettings.model.js";
import { checkSlugAvailabilityModel } from "../model/checkSlugAvailability.model.js";
import { getWorkspacePlanModel } from "../model/getWorkspacePlan.model.js";
import redisClient from "../../config/redis.js";

export async function updateWorkspaceSettingsService({
  workspaceId,
  userId,
  name,
  description,
  logoUrl,
  logoPublicId,
  slug,
}: {
  workspaceId: string;
  userId: string;
  name?: string | undefined;
  description?: string | null | undefined;
  logoUrl?: string | undefined;
  logoPublicId?: string | undefined;
  slug?: string | undefined;
}): Promise<{
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  slug: string;
}> {
  const canEditWorkspace = await checkPermission({
    userId,
    workspaceId,
    permission: Permission.EDIT_WORKSPACE,
  });

  if (!canEditWorkspace) {
    throw new Error("Insufficient permissions to edit workspace settings");
  }

  if (slug) {
    const workspacePlan = await getWorkspacePlanModel(workspaceId);

    if (workspacePlan !== "premium") {
      throw new Error("Slug can only be changed for premium workspaces");
    }

    const isSlugAvailable = await checkSlugAvailabilityModel(slug, workspaceId);

    if (!isSlugAvailable) {
      throw new Error("Slug is already taken");
    }
  }

  const result = await updateWorkspaceSettingsModel({
    workspaceId,
    name,
    description,
    logoUrl,
    logoPublicId,
    slug,
  });

  if (!result) {
    throw new Error("Failed to update workspace settings");
  }

  await redisClient.del(`workspace:${workspaceId}:basic-info`);

  return result;
}
