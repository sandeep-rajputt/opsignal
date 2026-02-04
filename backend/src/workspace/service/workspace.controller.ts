import { getAllWorkspaceModel } from "../model/workspace.model.js";

export async function getAllWorkspaceService(userId: string) {
  return getAllWorkspaceModel(userId);
}
