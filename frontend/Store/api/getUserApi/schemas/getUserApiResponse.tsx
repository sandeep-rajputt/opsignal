import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import userSchema from "@/schemas/userSchema";
import z from "zod";

const getUserApiResponseSchema = baseApiResponseSchema.extend({
  data: userSchema,
});

export type GetUserApiResponse = z.infer<typeof getUserApiResponseSchema>;
export default getUserApiResponseSchema;
