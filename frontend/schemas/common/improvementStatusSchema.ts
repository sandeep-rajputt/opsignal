import z from "zod";

const improvementStatusSchema = z.enum([
  "proposed",
  "approved",
  "in_progress",
  "done",
  "rejected",
]);

export type ImprovementStatus = z.infer<typeof improvementStatusSchema>;
export default improvementStatusSchema;
