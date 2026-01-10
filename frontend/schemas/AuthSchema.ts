import { z } from "zod";

const AuthSchema = z.object({
  token: z.string().min(1).nullable(),
  status: z.enum(["initial", "pending", "success", "failed"]),
});

export type Auth = z.infer<typeof AuthSchema>;
export default AuthSchema;
