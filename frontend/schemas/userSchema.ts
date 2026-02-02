import { z } from "zod";
import { timezoneSchema } from "./common/timezoneSchema";

export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  timezone: timezoneSchema,
  primaryWorkspace: z
    .object({
      id: z.string().uuid(),
      name: z.string().min(1, "Workspace name is required").optional(),
      slug: z.string().min(1, "Workspace slug is required").optional(),
    })
    .nullable(),
});

export type User = z.infer<typeof userSchema>;
