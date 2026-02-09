import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import roleSchema from "@/schemas/common/roleSchema";
import z from "zod";

const getWorkspaceBasicInfoResponseSchema = baseApiResponseSchema.extend({
  data: z.object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
    logo_url: z.string().nullable(),
    role: roleSchema.nullable(),
  }),
});

export type GetWorkspaceBasicInfoResponse = z.infer<
  typeof getWorkspaceBasicInfoResponseSchema
>;

export default getWorkspaceBasicInfoResponseSchema;
