import z from "zod";

const updateWorkspaceSettingsRequestSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional().nullable(),
  logoUrl: z.string().url().optional(),
  logoPublicId: z.string().optional(),
  slug: z.string().optional(),
});

export type UpdateWorkspaceSettingsRequest = z.infer<
  typeof updateWorkspaceSettingsRequestSchema
>;
