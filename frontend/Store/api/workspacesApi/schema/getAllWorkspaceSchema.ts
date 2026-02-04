import z from "zod";
import roleSchema from "@/schemas/common/roleSchema";
import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";

const getAllWorkspacesSchema = baseApiResponseSchema.extend({
  data: z.array(
    z.object({
      id: z.string(),
      name: z
        .string()
        .min(2, {
          message: "Workspace name must be at least 2 characters long.",
        })
        .max(50, { message: "Workspace name cannot exceed 50 characters." })
        .trim(),
      role: roleSchema,
      image: z.string().max(100, "Image url is too long"),
    }),
  ),
});

export type GetAllWorkspaces = z.infer<typeof getAllWorkspacesSchema>;

export default getAllWorkspacesSchema;
