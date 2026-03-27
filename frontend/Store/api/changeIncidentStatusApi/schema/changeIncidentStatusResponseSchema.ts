import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const changeIncidentStatusResponseSchema = baseApiResponseSchema.extend({
  data: z.null(),
});

export type ChangeIncidentStatusResponse = z.infer<
  typeof changeIncidentStatusResponseSchema
>;

export default changeIncidentStatusResponseSchema;
