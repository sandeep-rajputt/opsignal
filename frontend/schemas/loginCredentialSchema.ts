import { z } from "zod";
import passwordSchema from "@/schemas/common/passwordSchema";
import emailSchema from "@/schemas/common/emailSchema";

const loginCredentialSchema = z.object({
  email: emailSchema,

  password: z.string().min(1, { message: "Password is required" }),
});
export type LoginCredential = z.infer<typeof loginCredentialSchema>;
export default loginCredentialSchema;
