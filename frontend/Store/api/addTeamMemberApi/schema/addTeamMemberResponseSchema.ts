import z from "zod";
import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";

const addTeamMemberDataSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

const addTeamMemberResponseSchema = baseApiResponseSchema.extend({
  data: addTeamMemberDataSchema,
});

export type AddTeamMemberResponse = z.infer<typeof addTeamMemberResponseSchema>;

export default addTeamMemberResponseSchema;
