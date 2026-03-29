import z from "zod";

const workspaceSettingsSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Workspace name must be at least 2 characters long." })
    .max(50, { message: "Workspace name cannot exceed 50 characters." })
    .trim(),

  description: z
    .string()
    .max(200, { message: "Description cannot exceed 200 characters." })
    .optional(),

  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long." })
    .max(50, { message: "Slug cannot exceed 50 characters." })
    .regex(/^[a-z0-9-]+$/, {
      message: "Slug can only contain lowercase letters, numbers, and hyphens.",
    })
    .trim()
    .optional(),
});

export type WorkspaceSettings = z.infer<typeof workspaceSettingsSchema>;

export default workspaceSettingsSchema;
