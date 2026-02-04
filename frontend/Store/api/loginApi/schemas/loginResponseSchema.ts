import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import userSchema from "@/schemas/userSchema";
import { z } from "zod";

const loginResponseSchema = baseApiResponseSchema.extend({
  data: userSchema,
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export default loginResponseSchema;
