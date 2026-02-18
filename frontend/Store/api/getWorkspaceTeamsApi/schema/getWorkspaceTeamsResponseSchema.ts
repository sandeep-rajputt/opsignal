import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const teamSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  avatar_url: z.string().nullable(),
  created_at: z.string(),
});

const getWorkspaceTeamsResponseSchema = baseApiResponseSchema.extend({
  data: z.array(teamSchema),
});

export type GetWorkspaceTeamsResponse = z.infer<
  typeof getWorkspaceTeamsResponseSchema
>;

export type Team = z.infer<typeof teamSchema>;

export default getWorkspaceTeamsResponseSchema;
