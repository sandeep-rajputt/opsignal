import z from "zod";
import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";

const uploadSignatureDataSchema = z.object({
  signature: z.string(),
  timestamp: z.number(),
  cloudName: z.string(),
  apiKey: z.string(),
});

const uploadSignatureResponseSchema = baseApiResponseSchema.extend({
  data: uploadSignatureDataSchema,
});

export type UploadSignatureResponse = z.infer<
  typeof uploadSignatureResponseSchema
>;
