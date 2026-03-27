import z from "zod";

export const changeTaskPriorityValidation = z.object({
  priority: z.enum(["urgent", "high", "medium", "low"]),
});

export type ChangeTaskPriorityInput = z.infer<
  typeof changeTaskPriorityValidation
>;
