import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const changeTaskStatusResponseSchema = baseApiResponseSchema.extend({
  data: z.null(),
});

export type ChangeTaskStatusResponse = z.infer<
  typeof changeTaskStatusResponseSchema
>;

export default changeTaskStatusResponseSchema;
