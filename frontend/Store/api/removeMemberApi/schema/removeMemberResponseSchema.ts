import z from "zod";
import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";

const removeMemberDataSchema = z.object({
  success: z.boolean(),
});

const removeMemberResponseSchema = baseApiResponseSchema.extend({
  data: removeMemberDataSchema,
});

export type RemoveMemberResponse = z.infer<typeof removeMemberResponseSchema>;

export default removeMemberResponseSchema;
