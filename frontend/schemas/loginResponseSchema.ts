import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import { z } from "zod";

const loginResponseSchema = baseApiResponseSchema.extend({
  data: z.object({
    token: z.string().min(1, "Token is required"),
  }),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export default loginResponseSchema;
