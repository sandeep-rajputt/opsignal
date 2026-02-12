import { z } from "zod";

export const verifyPaymentRequestSchema = z.object({
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
  workspaceId: z.string(),
});

export type VerifyPaymentRequestSchema = z.infer<
  typeof verifyPaymentRequestSchema
>;
