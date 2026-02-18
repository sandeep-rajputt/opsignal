import { z } from "zod";
import emailSchema from "./common/emailSchema";

const addTeamMemberSchema = z.object({
  email: emailSchema,
  teamId: z.string().min(1, { message: "Please select a team" }),
});

export type AddTeamMemberData = z.infer<typeof addTeamMemberSchema>;

export default addTeamMemberSchema;
