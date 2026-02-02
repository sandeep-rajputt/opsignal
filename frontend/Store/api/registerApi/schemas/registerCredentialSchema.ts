import { z } from "zod";
import passwordSchema from "@/schemas/common/passwordSchema";
import emailSchema from "@/schemas/common/emailSchema";

const registerCredentialSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must contain at least 2 characters." })
      .max(20, { message: "Name cannot exceed 20 characters." }),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });

export type RegisterCredential = z.infer<typeof registerCredentialSchema>;
export default registerCredentialSchema;
