import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import workLogsSchema from "@/schemas/workLogsSchema";
import z from "zod";

const getTaskLogsResponseSchema = baseApiResponseSchema.extend({
  data: workLogsSchema,
});

export type GetTaskLogsResponse = z.infer<typeof getTaskLogsResponseSchema>;

export default getTaskLogsResponseSchema;
