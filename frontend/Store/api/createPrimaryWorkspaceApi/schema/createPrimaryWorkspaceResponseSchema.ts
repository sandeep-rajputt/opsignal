import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import z from "zod";

const createPrimaryWorkspaceResponseSchema = baseApiResponseSchema.extend({
  data: z.object({
    id: z.string(),
  }),
});

export type CreatePrimaryWorkspaceResponseSchema = z.infer<
  typeof createPrimaryWorkspaceResponseSchema
>;

export default createPrimaryWorkspaceResponseSchema;
