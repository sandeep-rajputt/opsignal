import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const changeImprovementStatusResponseSchema = baseApiResponseSchema.extend({
  data: z.null(),
});

export type ChangeImprovementStatusResponse = z.infer<
  typeof changeImprovementStatusResponseSchema
>;

export default changeImprovementStatusResponseSchema;
