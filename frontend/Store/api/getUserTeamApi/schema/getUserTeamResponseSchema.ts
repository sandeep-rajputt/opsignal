import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const userTeamSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  avatar_url: z.string().nullable(),
});

const getUserTeamResponseSchema = baseApiResponseSchema.extend({
  data: userTeamSchema.nullable(),
});

export type GetUserTeamResponse = z.infer<typeof getUserTeamResponseSchema>;

export type UserTeam = z.infer<typeof userTeamSchema>;

export default getUserTeamResponseSchema;
