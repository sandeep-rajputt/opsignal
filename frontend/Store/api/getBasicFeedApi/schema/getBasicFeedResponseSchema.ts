import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const getBasicFeedResponseSchema = baseApiResponseSchema.extend({
  data: z.object({
    totalMembers: z.number(),
    memberLimit: z.number().nullable(),
    incidents: z.object({
      total: z.number(),
      critical: z.number(),
    }),
    tasks: z.object({
      total: z.number(),
      urgent: z.number(),
    }),
    improvements: z.object({
      total: z.number(),
    }),
  }),
});

export type GetBasicFeedResponse = z.infer<typeof getBasicFeedResponseSchema>;

export default getBasicFeedResponseSchema;
