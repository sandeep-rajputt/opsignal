import z from "zod";

export const createIncidentValidation = z.object({
  title: z.string().min(10).max(50),
  severity: z.enum(["critical", "high", "medium", "low"]),
  teamId: z.string().min(1).max(36),
  description: z.string().max(500).optional(),
});

export const createTaskValidation = z.object({
  title: z.string().min(5).max(100),
  priority: z.enum(["urgent", "high", "medium", "low"]),
  teamId: z.string().min(1).max(36),
  description: z.string().max(500).optional(),
  dueDate: z.string().optional(),
});

export const createImprovementValidation = z.object({
  title: z.string().min(5).max(100),
  category: z.enum(["process", "technical", "documentation", "other"]),
  teamId: z.string().min(1).max(36),
  description: z.string().max(500).optional(),
  expectedImpact: z.string().max(300).optional(),
});

export type CreateIncidentInput = z.infer<typeof createIncidentValidation>;
export type CreateTaskInput = z.infer<typeof createTaskValidation>;
export type CreateImprovementInput = z.infer<
  typeof createImprovementValidation
>;
