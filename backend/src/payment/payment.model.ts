import { pool } from "../config/db.js";
import type { PaymentRecord } from "./payment.types.js";

export async function createPaymentRecordModel({
  workspaceId,
  userId,
  razorpayOrderId,
  amount,
  plan,
}: {
  workspaceId: string | null;
  userId: string;
  razorpayOrderId: string;
  amount: number;
  plan: string;
}): Promise<PaymentRecord | null> {
  try {
    const result = await pool.query<PaymentRecord>(
      `
      INSERT INTO payments(workspace_id, user_id, razorpay_order_id, amount, currency, status, plan)
      VALUES ($1, $2, $3, $4, 'INR', 'created', $5)
      RETURNING *
      `,
      [workspaceId, userId, razorpayOrderId, amount, plan],
    );

    return result.rows[0] || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updatePaymentRecordModel({
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  status,
}: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
  status: "paid" | "failed";
}): Promise<PaymentRecord | null> {
  try {
    const result = await pool.query<PaymentRecord>(
      `
      UPDATE payments
      SET razorpay_payment_id = $1,
          razorpay_signature = $2,
          status = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE razorpay_order_id = $4
      RETURNING *
      `,
      [razorpayPaymentId, razorpaySignature, status, razorpayOrderId],
    );

    return result.rows[0] || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function getPaymentByOrderIdModel(
  razorpayOrderId: string,
): Promise<PaymentRecord | null> {
  try {
    const result = await pool.query<PaymentRecord>(
      `
      SELECT * FROM payments
      WHERE razorpay_order_id = $1
      `,
      [razorpayOrderId],
    );

    return result.rows[0] || null;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function updateWorkspacePlanModel(
  workspaceId: string,
  plan: string,
): Promise<boolean> {
  try {
    const result = await pool.query(
      `
      UPDATE workspaces
      SET plan = $1
      WHERE slug = $2
      `,
      [plan, workspaceId],
    );

    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function incrementUserSlotsModel(
  userId: string,
): Promise<boolean> {
  try {
    const result = await pool.query(
      `
      UPDATE users
      SET slots = slots + 1
      WHERE id = $1
      `,
      [userId],
    );

    return result.rowCount !== null && result.rowCount > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
}
