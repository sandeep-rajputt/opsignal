import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const createIncidentResponseSchema = baseApiResponseSchema.extend({
  data: z.object({
    id: z.string(),
  }),
});

export type CreateIncidentResponse = z.infer<
  typeof createIncidentResponseSchema
>;

export default createIncidentResponseSchema;
