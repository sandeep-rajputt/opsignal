export interface CreateOrderPayload {
  workspaceId: string;
  plan: "premium";
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  workspaceId: string;
}

export interface PaymentRecord {
  id: string;
  workspace_id: string | null;
  user_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  razorpay_signature: string | null;
  amount: number;
  currency: string;
  status: "created" | "paid" | "failed";
  plan: string;
  created_at: Date;
  updated_at: Date;
}
