import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const createWorkspaceResponseSchema = baseApiResponseSchema.extend({
  data: z.object({
    id: z.string(),
  }),
});

export type CreateWorkspaceResponseSchema = z.infer<
  typeof createWorkspaceResponseSchema
>;

export default createWorkspaceResponseSchema;
