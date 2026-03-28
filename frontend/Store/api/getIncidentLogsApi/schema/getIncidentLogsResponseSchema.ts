import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import workLogsSchema from "@/schemas/workLogsSchema";
import z from "zod";

const getIncidentLogsResponseSchema = baseApiResponseSchema.extend({
  data: workLogsSchema,
});

export type GetIncidentLogsResponse = z.infer<
  typeof getIncidentLogsResponseSchema
>;

export default getIncidentLogsResponseSchema;
