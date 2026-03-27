import z from "zod";

export const changeTaskStatusValidation = z.object({
  status: z.enum(["open", "in_progress", "blocked", "done", "cancelled"]),
});

export type ChangeTaskStatusInput = z.infer<typeof changeTaskStatusValidation>;
