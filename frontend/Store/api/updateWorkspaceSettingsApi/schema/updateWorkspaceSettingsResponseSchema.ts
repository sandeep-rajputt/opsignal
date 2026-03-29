import z from "zod";
import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";

const updateWorkspaceSettingsDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  logo_url: z.string().nullable(),
  slug: z.string(),
});

const updateWorkspaceSettingsResponseSchema = baseApiResponseSchema.extend({
  data: updateWorkspaceSettingsDataSchema,
});

export type UpdateWorkspaceSettingsResponse = z.infer<
  typeof updateWorkspaceSettingsResponseSchema
>;
