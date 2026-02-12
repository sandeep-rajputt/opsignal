import { z } from "zod";
import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";

const verifyPaymentDataSchema = z.object({
  verified: z.boolean(),
  plan: z.string(),
});

export const verifyPaymentResponseSchema = baseApiResponseSchema.extend({
  data: verifyPaymentDataSchema,
});

export type VerifyPaymentResponseSchema = z.infer<
  typeof verifyPaymentResponseSchema
>;
