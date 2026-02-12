import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import { razorpay } from "../config/razorpay.js";
import { createPaymentRecordModel } from "./payment.model.js";
import safeResponse from "../utils/safeResponse.js";

const SLOT_PRICE = 1000; // ₹10.00 in paise

export async function createSlotOrderService(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const userId = req.user?.id!;

  try {
    const order = await razorpay.orders.create({
      amount: SLOT_PRICE,
      currency: "INR",
      receipt: `slot_${userId.slice(0, 20)}`,
    });

    const paymentRecord = await createPaymentRecordModel({
      workspaceId: null,
      userId,
      razorpayOrderId: order.id,
      amount: SLOT_PRICE,
      plan: "workspace_slot",
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
