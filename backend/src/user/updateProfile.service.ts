import { updateProfileModel } from "./updateProfile.model.js";
import redisClient from "../config/redis.js";

export async function updateProfileService(
  userId: string,
  name: string,
  avatarUrl?: string,
  avatarPublicId?: string,
) {
  const result = await updateProfileModel(
    userId,
    name,
    avatarUrl,
    avatarPublicId,
  );

  // Invalidate user cache
  await redisClient.del(`user:${userId}`);

  return result;
}
