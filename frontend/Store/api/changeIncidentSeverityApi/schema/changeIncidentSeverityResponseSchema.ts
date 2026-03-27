import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const changeIncidentSeverityResponseSchema = baseApiResponseSchema.extend({
  data: z.null(),
});

export type ChangeIncidentSeverityResponse = z.infer<
  typeof changeIncidentSeverityResponseSchema
>;

export default changeIncidentSeverityResponseSchema;
