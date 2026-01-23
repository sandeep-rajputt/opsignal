import z from "zod";

const nullApiResponseSchema = z.object({
  status: z.number().min(100).max(599),
  message: z.string(),
  path: z.string(),
  data: z.unknown(),
  timestamp: z.date(),
});

export type NullApiResponse = z.infer<typeof nullApiResponseSchema>;
export default nullApiResponseSchema;
