import z from "zod";

const baseApiResponseSchema = z.object({
  message: z.string(),
  status: z.number().min(1, "Invalid Status").max(599, "Invalid Status"),
  path: z.string(),
  timestamp: z.number(),
});

export default baseApiResponseSchema;
