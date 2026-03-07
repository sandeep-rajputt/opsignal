import z from "zod";
import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";

const updateMemberRoleDataSchema = z.object({
  success: z.boolean(),
});

const updateMemberRoleResponseSchema = baseApiResponseSchema.extend({
  data: updateMemberRoleDataSchema,
});

export type UpdateMemberRoleResponse = z.infer<
  typeof updateMemberRoleResponseSchema
>;

export default updateMemberRoleResponseSchema;
