import { z } from "zod";
import emailSchema from "../schemas/common/emailSchema.js";
import nameSchema from "../schemas/common/nameSchema.js";
import passwordSchema from "../schemas/common/passwordSchema.js";

const createUserSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
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

const loginUserSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export { createUserSchema, loginUserSchema };
