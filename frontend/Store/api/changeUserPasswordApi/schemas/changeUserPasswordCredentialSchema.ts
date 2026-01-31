import { z } from "zod";
import passwordSchema from "@/schemas/common/passwordSchema";

const changeUserPasswordCredentialSchema = z
  .object({
    token: z.string().min(1, "Token is required"),
    id: z.string().min(1, "ID is required"),
    newPassword: passwordSchema,
    confirmNewPassword: passwordSchema,
  })
  .superRefine((data, ctx) => {
    if (data.newPassword !== data.confirmNewPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmNewPassword"],
        message: "Passwords do not match.",
      });
    }
  });

export type ChangeUserPasswordCredential = z.infer<
  typeof changeUserPasswordCredentialSchema
>;
export default changeUserPasswordCredentialSchema;
