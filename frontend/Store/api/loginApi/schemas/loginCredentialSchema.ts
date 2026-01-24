import { z } from "zod";
import passwordSchema from "@/schemas/common/passwordSchema";
import emailSchema from "@/schemas/common/emailSchema";

const loginCredentialSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});
export type LoginCredential = z.infer<typeof loginCredentialSchema>;
export default loginCredentialSchema;
