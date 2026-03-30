import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const getTasksByStatusResponseSchema = baseApiResponseSchema.extend({
  data: z.object({
    open: z.number(),
    inProgress: z.number(),
    blocked: z.number(),
    done: z.number(),
    cancelled: z.number(),
  }),
});

export type GetTasksByStatusResponse = z.infer<
  typeof getTasksByStatusResponseSchema
>;

export default getTasksByStatusResponseSchema;
