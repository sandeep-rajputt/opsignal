import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import roleSchema from "@/schemas/common/roleSchema";
import z from "zod";

const getUserRoleResponseSchema = baseApiResponseSchema.extend({
  message: roleSchema,
  data: z.null(),
});

export type GetUserRoleResponse = z.infer<typeof getUserRoleResponseSchema>;

export default getUserRoleResponseSchema;
