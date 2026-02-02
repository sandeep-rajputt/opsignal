import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";
import emailSchema from "@/schemas/common/emailSchema";
import { timezoneSchema } from "@/schemas/common/timezoneSchema";
import { z } from "zod";

const loginResponseSchema = baseApiResponseSchema.extend({
  data: z.object({
    workspaceId: z.string().optional(),
    timezone: timezoneSchema,
    name: z
      .string()
      .min(2, { message: "Name must contain at least 2 characters." })
      .max(20, { message: "Name cannot exceed 20 characters." }),
    email: emailSchema,
  }),
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;
export default loginResponseSchema;
