import { z } from "zod";
import { timezoneSchema } from "./common/timezoneSchema";

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  timezone: timezoneSchema,
  workspace: z.string().nullable,
  avatarUrl: z.string().nullable().optional(),
  slots: z.number(),
});

export type User = z.infer<typeof userSchema>;
export default userSchema;
