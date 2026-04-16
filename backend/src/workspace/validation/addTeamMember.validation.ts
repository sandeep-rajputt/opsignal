import { z } from "zod";

export const addTeamMemberSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid email address." })
    .max(50, { message: "Email cannot exceed 50 characters." }),
  teamId: z.string().uuid({ message: "Invalid team ID" }),
});

export type AddTeamMemberInput = z.infer<typeof addTeamMemberSchema>;
