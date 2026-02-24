import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import roleSchema from "@/schemas/common/roleSchema";
import z from "zod";

const getMembersResponseSchema = baseApiResponseSchema.extend({
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
        team_id: z.string().nullable(),
      }),
    ),
    total: z.number(),
    page: z.number(),
    limit: z.number(),
  }),
});

export type GetMembersResponse = z.infer<typeof getMembersResponseSchema>;

export default getMembersResponseSchema;
