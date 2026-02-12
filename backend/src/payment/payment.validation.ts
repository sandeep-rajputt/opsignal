import { z } from "zod";

export const createOrderSchema = z.object({
  workspaceId: z.string().min(1, "Workspace ID is required"),
  plan: z.literal("premium").refine((val) => val === "premium", {
    message: "Only premium plan requires payment",
  }),
});

export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, "Order ID is required"),
  razorpay_payment_id: z.string().min(1, "Payment ID is required"),
  razorpay_signature: z.string().min(1, "Signature is required"),
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

export type CreateOrderSchema = z.infer<typeof createOrderSchema>;
export type VerifyPaymentSchema = z.infer<typeof verifyPaymentSchema>;
