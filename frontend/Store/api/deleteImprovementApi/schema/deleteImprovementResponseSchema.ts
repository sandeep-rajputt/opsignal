import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const deleteImprovementResponseSchema = baseApiResponseSchema.extend({
  data: z.null(),
});

export type DeleteImprovementResponse = z.infer<
  typeof deleteImprovementResponseSchema
>;

export default deleteImprovementResponseSchema;
