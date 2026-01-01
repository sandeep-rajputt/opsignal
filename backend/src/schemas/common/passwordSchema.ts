import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long." })
  .max(50, { message: "Password cannot be longer than 50 characters." })
  .superRefine((data, ctx) => {
    const containNumberRegex = /\d/;
    if (!containNumberRegex.test(data.trim())) {
      ctx.addIssue({
        message: "Password must contain at least one number.",
        code: z.ZodIssueCode.custom,
      });
    }

    const containUppercaseRegex = /[A-Z]/;
    if (!containUppercaseRegex.test(data.trim())) {
      ctx.addIssue({
        message: "Password must include at least one uppercase letter.",
        code: z.ZodIssueCode.custom,
      });
    }

    const containLowercaseRegex = /[a-z]/;
    if (!containLowercaseRegex.test(data.trim())) {
      ctx.addIssue({
        message: "Password must include at least one lowercase letter.",
        code: z.ZodIssueCode.custom,
      });
    }

    const containSpecialCharRegex = /[@$!%*?&]/;
    if (!containSpecialCharRegex.test(data.trim())) {
      ctx.addIssue({
        message:
          "Password must contain at least one special character (@ $ ! % * ? &).",
        code: z.ZodIssueCode.custom,
      });
    }
  })
  .trim();

export default passwordSchema;
