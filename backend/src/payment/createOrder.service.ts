import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { razorpay } from "../config/razorpay.js";
import { createPaymentRecordModel } from "./payment.model.js";
import safeResponse from "../utils/safeResponse.js";
import { createOrderSchema } from "./payment.validation.js";

const PLAN_PRICES: Record<"premium", number> = {
  premium: 1900,
} as const;

export async function createOrderService(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { workspaceId, plan } = req.body;

  const resData = await createOrderSchema.safeParseAsync({
    workspaceId,
    plan,
  });

  if (!resData.success) {
    return next(createHttpError(400, "Invalid input data"));
  }

  const amount = PLAN_PRICES[resData.data.plan as "premium"];

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `rcpt_${workspaceId.slice(0, 20)}`,
    });

    const paymentRecord = await createPaymentRecordModel({
      workspaceId: resData.data.workspaceId,
      userId: req.user?.id!,
      razorpayOrderId: order.id,
      amount,
      plan: resData.data.plan as string,
    });

    if (!paymentRecord) {
      return next(createHttpError(500, "Failed to create payment record"));
    }

    return safeResponse(res, {
      status: 201,
      message: "Order created successfully",
      path: req.originalUrl,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        key: process.env.RAZORPAY_KEY_ID!,
      },
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Failed to create order"));
  }
}
