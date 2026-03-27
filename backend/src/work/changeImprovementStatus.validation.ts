import z from "zod";

export const changeImprovementStatusValidation = z.object({
  status: z.enum(["proposed", "approved", "in_progress", "done", "rejected"]),
});

export type ChangeImprovementStatusInput = z.infer<
  typeof changeImprovementStatusValidation
>;
