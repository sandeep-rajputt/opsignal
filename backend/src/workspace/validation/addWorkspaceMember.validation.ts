import { z } from "zod";
import { ROLE } from "../../rbac/roles.js";

export const addWorkspaceMemberSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(50, { message: "Email cannot exceed 50 characters." }),
  role: z
    .nativeEnum(ROLE, {
      message: "Invalid role. Must be one of: admin, moderator, member",
    })
    .refine((role) => role !== ROLE.OWNER, {
      message: "Cannot assign owner role",
    }),
  teamId: z.string().uuid({ message: "Invalid team ID" }),
});

export type AddWorkspaceMemberInput = z.infer<typeof addWorkspaceMemberSchema>;
