import z from "zod";

const createImprovementSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters")
    .max(100, "Title must be 100 characters or less"),
  category: z.enum(["process", "technical", "documentation", "other"], {
    error: "Select a valid category",
  }),
  teamId: z.string().min(1, "Select a team").max(36, "Invalid team ID"),
  ownerId: z.string().min(1, "Select an owner").max(36, "Invalid owner ID"),
  description: z
    .string()
    .max(500, "Description must be 500 characters or less")
    .optional(),
  expectedImpact: z
    .string()
    .max(300, "Expected impact must be 300 characters or less")
    .optional(),
});

export type CreateImprovement = z.infer<typeof createImprovementSchema>;

export default createImprovementSchema;
