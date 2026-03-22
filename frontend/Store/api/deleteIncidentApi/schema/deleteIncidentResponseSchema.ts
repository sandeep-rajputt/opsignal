import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const deleteIncidentResponseSchema = baseApiResponseSchema.extend({
  data: z.null(),
});

export type DeleteIncidentResponse = z.infer<
  typeof deleteIncidentResponseSchema
>;

export default deleteIncidentResponseSchema;
