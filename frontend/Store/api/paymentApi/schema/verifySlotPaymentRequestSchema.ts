import { z } from "zod";

export const verifySlotPaymentRequestSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export type VerifySlotPaymentRequestSchema = z.infer<
  typeof verifySlotPaymentRequestSchema
>;
