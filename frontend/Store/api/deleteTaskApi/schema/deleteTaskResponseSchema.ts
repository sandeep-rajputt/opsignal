import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const deleteTaskResponseSchema = baseApiResponseSchema.extend({
  data: z.null(),
});

export type DeleteTaskResponse = z.infer<typeof deleteTaskResponseSchema>;

export default deleteTaskResponseSchema;
