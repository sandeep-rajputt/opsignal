import { revokeSessionModel } from "./revokeSession.model.js";

export async function revokeSessionService(sessionId: string, userId: string) {
  const result = await revokeSessionModel(sessionId, userId);
  return result;
}
