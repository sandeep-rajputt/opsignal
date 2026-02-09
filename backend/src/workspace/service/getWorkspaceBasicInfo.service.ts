import { getWorkspaceBasicInfoModel } from "../model/getWorkspaceBasicInfo.model.js";

export async function getWorkspaceBasicInfoService(
  workspaceId: string,
  userId: string,
) {
  const workspace = await getWorkspaceBasicInfoModel(workspaceId, userId);
  return workspace;
}
