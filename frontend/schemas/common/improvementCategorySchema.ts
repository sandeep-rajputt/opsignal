import z from "zod";

const improvementCategorySchema = z.enum([
  "process",
  "technical",
  "documentation",
  "other",
]);

export type ImprovementCategory = z.infer<typeof improvementCategorySchema>;
export default improvementCategorySchema;
