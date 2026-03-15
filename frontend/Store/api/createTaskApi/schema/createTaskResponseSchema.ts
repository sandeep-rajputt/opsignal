import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const createTaskResponseSchema = baseApiResponseSchema.extend({
  data: z.object({
    id: z.string(),
  }),
});

export type CreateTaskResponse = z.infer<typeof createTaskResponseSchema>;

export default createTaskResponseSchema;
