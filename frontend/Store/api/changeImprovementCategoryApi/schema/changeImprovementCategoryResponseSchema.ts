import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const changeImprovementCategoryResponseSchema = baseApiResponseSchema.extend({
  data: z.null(),
});

export type ChangeImprovementCategoryResponse = z.infer<
  typeof changeImprovementCategoryResponseSchema
>;

export default changeImprovementCategoryResponseSchema;
