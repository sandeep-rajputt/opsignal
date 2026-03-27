import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const changeTaskPriorityResponseSchema = baseApiResponseSchema.extend({
  data: z.null(),
});

export type ChangeTaskPriorityResponse = z.infer<
  typeof changeTaskPriorityResponseSchema
>;

export default changeTaskPriorityResponseSchema;
