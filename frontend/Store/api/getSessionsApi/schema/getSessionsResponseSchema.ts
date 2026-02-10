import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const getSessionsResponseSchema = baseApiResponseSchema.extend({
  data: z.array(
    z.object({
      id: z.string(),
      ip_address: z.string().nullable(),
      location: z.string().nullable(),
      device: z.string().nullable(),
      created_at: z.string(),
      updated_at: z.string(),
      expires_at: z.string(),
    }),
  ),
});

export type GetSessionsResponse = z.infer<typeof getSessionsResponseSchema>;
export default getSessionsResponseSchema;
