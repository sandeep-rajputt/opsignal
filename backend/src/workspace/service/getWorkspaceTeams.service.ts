import redisClient from "../../config/redis.js";
import { getWorkspaceTeamsModel } from "../model/getWorkspaceTeams.model.js";

export async function getWorkspaceTeamsService(workspaceId: string) {
  // Try to get teams from Redis cache
  const cacheKey = `workspaces:${workspaceId}:teams`;
  const cachedTeams = await redisClient.get(cacheKey);

  if (cachedTeams) {
    return JSON.parse(cachedTeams);
  }

  // If not in cache, fetch from database
  const teams = await getWorkspaceTeamsModel(workspaceId);

  // Cache the teams in Redis (expire in 1 hour)
  await redisClient.setex(cacheKey, 3600, JSON.stringify(teams));

  return teams;
}
