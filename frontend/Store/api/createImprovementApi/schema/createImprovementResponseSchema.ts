import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const createImprovementResponseSchema = baseApiResponseSchema.extend({
  data: z.object({
    id: z.string(),
  }),
});

export type CreateImprovementResponse = z.infer<
  typeof createImprovementResponseSchema
>;

export default createImprovementResponseSchema;
