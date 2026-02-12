import { z } from "zod";
import baseApiResponseSchema from "@/schemas/baseApiResponseSchema";

const verifySlotPaymentDataSchema = z.object({
  verified: z.boolean(),
  slotsAdded: z.number(),
});

export const verifySlotPaymentResponseSchema = baseApiResponseSchema.extend({
  data: verifySlotPaymentDataSchema,
});

export type VerifySlotPaymentResponseSchema = z.infer<
  typeof verifySlotPaymentResponseSchema
>;
