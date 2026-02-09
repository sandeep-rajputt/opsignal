import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import roleSchema from "@/schemas/common/roleSchema";
import z from "zod";

const getWorkspaceMembersResponseSchema = baseApiResponseSchema.extend({
  data: z.object({
    data: z.array(
      z.object({
        id: z.string(),
        role: roleSchema,
        joined_at: z.string(),
        user_id: z.string(),
        name: z.string(),
        email: z.string(),
        avatar_url: z.string().nullable(),
      }),
    ),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  }),
});

export type GetWorkspaceMembersResponse = z.infer<
  typeof getWorkspaceMembersResponseSchema
>;

export default getWorkspaceMembersResponseSchema;
