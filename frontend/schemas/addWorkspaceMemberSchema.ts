import { z } from "zod";
import emailSchema from "./common/emailSchema";
import roleSchema from "./common/roleSchema";

const addWorkspaceMemberSchema = z.object({
  email: emailSchema,
  role: roleSchema.exclude(["owner"]),
  teamId: z.string().min(1, { message: "Please select a team" }),
});

export type AddWorkspaceMemberData = z.infer<typeof addWorkspaceMemberSchema>;

export default addWorkspaceMemberSchema;
