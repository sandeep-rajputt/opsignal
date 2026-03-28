import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import workLogsSchema from "@/schemas/workLogsSchema";
import z from "zod";

const getImprovementLogsResponseSchema = baseApiResponseSchema.extend({
  data: workLogsSchema,
});

export type GetImprovementLogsResponse = z.infer<
  typeof getImprovementLogsResponseSchema
>;

export default getImprovementLogsResponseSchema;
