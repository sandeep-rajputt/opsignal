import { getUserSessionsModel } from "./getUserSessions.model.js";

export async function getUserSessionsService(userId: string) {
  const sessions = await getUserSessionsModel(userId);
  return sessions;
}
