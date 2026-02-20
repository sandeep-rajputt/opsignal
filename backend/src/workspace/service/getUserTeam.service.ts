import redisClient from "../../config/redis.js";
import { getUserTeamModel } from "../model/getUserTeam.model.js";

export async function getUserTeamService(userId: string, workspaceId: string) {
  // Try to get team from Redis cache
  const cacheKey = `users:${userId}:workspaces:${workspaceId}:team`;
  const cachedTeamId = await redisClient.get(cacheKey);

  // If we have a cached team ID, fetch the full team details
  if (cachedTeamId && cachedTeamId !== "null") {
    // Try to get team details from cache
    const teamDetailsCacheKey = `teams:${cachedTeamId}:details`;
    const cachedTeamDetails = await redisClient.get(teamDetailsCacheKey);

    if (cachedTeamDetails) {
      return JSON.parse(cachedTeamDetails);
    }
  }

  // If not in cache or cache miss, fetch from database
  const team = await getUserTeamModel(userId, workspaceId);

  // Cache the team details if found
  if (team) {
    const teamDetailsCacheKey = `teams:${team.id}:details`;
    await redisClient.setex(teamDetailsCacheKey, 3600, JSON.stringify(team));
  }

  return team;
}
