import z from "zod";

const createTaskSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be 100 characters or less"),
  priority: z.enum(["urgent", "high", "medium", "low"], {
    error: "Select a valid priority level",
  }),
  teamId: z.string().min(1, "Select a team").max(36, "Invalid team ID"),
  assigneeId: z
    .string()
    .min(1, "Select an assignee")
    .max(36, "Invalid assignee ID"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional(),
  dueDate: z.string().optional(),
});

export type CreateTask = z.infer<typeof createTaskSchema>;

export default createTaskSchema;
