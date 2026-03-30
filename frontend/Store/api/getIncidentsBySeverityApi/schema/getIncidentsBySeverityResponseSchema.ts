import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const getIncidentsBySeverityResponseSchema = baseApiResponseSchema.extend({
  data: z.object({
    critical: z.number(),
    high: z.number(),
    medium: z.number(),
    low: z.number(),
  }),
});

export type GetIncidentsBySeverityResponse = z.infer<
  typeof getIncidentsBySeverityResponseSchema
>;

export default getIncidentsBySeverityResponseSchema;
