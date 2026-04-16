import z from "zod";
import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";

const addWorkspaceMemberDataSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

const addWorkspaceMemberResponseSchema = baseApiResponseSchema.extend({
  data: addWorkspaceMemberDataSchema,
});

export type AddWorkspaceMemberResponse = z.infer<
  typeof addWorkspaceMemberResponseSchema
>;

export default addWorkspaceMemberResponseSchema;
