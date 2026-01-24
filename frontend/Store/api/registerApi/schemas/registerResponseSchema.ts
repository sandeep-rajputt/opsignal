import z from "zod";

const registerResponseSchema = z.object({
  status: z.number().min(100).max(599),
  message: z.string(),
  path: z.string(),
  data: z.object({
    id: z.string(),
  }),
  timestamp: z.date(),
});

export type RegisterResponse = z.infer<typeof registerResponseSchema>;
export default registerResponseSchema;
