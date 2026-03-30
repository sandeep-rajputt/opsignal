import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const getRecentActivityResponseSchema = baseApiResponseSchema.extend({
  data: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      title: z.string(),
      status: z.string(),
      severityOrPriority: z.string().nullable(),
      category: z.string().nullable(),
      createdBy: z.string(),
      createdById: z.string(),
      createdAt: z.string(),
      teamName: z.string().nullable(),
    }),
  ),
});

export type GetRecentActivityResponse = z.infer<
  typeof getRecentActivityResponseSchema
>;

export default getRecentActivityResponseSchema;
