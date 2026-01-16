import z from "zod";

const operationalErrorSchema = z.object({
  message: z.string(),
  status: z.number(),
  path: z.string(),
  data: z.any(),
});

const registerErrorResponseSchema = z.object({
  data: operationalErrorSchema,
  status: z.number(),
});

export type RegisterErrorResponse = z.infer<typeof registerErrorResponseSchema>;
export default registerErrorResponseSchema;
