import z from "zod";

export const changeImprovementCategoryValidation = z.object({
  category: z.enum(["process", "technical", "documentation", "other"]),
});

export type ChangeImprovementCategoryInput = z.infer<
  typeof changeImprovementCategoryValidation
>;
