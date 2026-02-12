import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import crypto from "crypto";
import {
  getPaymentByOrderIdModel,
  updatePaymentRecordModel,
} from "./payment.model.js";
import { incrementUserSlotsModel } from "./payment.model.js";
import safeResponse from "../utils/safeResponse.js";
import { z } from "zod";
import redisClient from "../config/redis.js";

const verifySlotPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1, "Order ID is required"),
  razorpay_payment_id: z.string().min(1, "Payment ID is required"),
  razorpay_signature: z.string().min(1, "Signature is required"),
});

export async function verifySlotPaymentService(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const resData = await verifySlotPaymentSchema.safeParseAsync({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  });

  if (!resData.success) {
    return next(createHttpError(400, "Invalid input data"));
  }

  try {
    const paymentRecord = await getPaymentByOrderIdModel(
      resData.data.razorpay_order_id,
    );

    if (!paymentRecord) {
      return next(createHttpError(404, "Payment record not found"));
    }

    if (paymentRecord.user_id !== req.user?.id) {
      return next(createHttpError(403, "Unauthorized"));
    }

    if (paymentRecord.plan !== "workspace_slot") {
      return next(createHttpError(400, "Invalid payment type"));
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(
        `${resData.data.razorpay_order_id}|${resData.data.razorpay_payment_id}`,
      )
      .digest("hex");

    if (generatedSignature !== resData.data.razorpay_signature) {
      await updatePaymentRecordModel({
        razorpayOrderId: resData.data.razorpay_order_id,
        razorpayPaymentId: resData.data.razorpay_payment_id,
        razorpaySignature: resData.data.razorpay_signature,
        status: "failed",
      });

      return next(createHttpError(400, "Invalid payment signature"));
    }

    const updatedPayment = await updatePaymentRecordModel({
      razorpayOrderId: resData.data.razorpay_order_id,
      razorpayPaymentId: resData.data.razorpay_payment_id,
      razorpaySignature: resData.data.razorpay_signature,
      status: "paid",
    });

    if (!updatedPayment) {
      return next(createHttpError(500, "Failed to update payment record"));
    }

    const slotsIncremented = await incrementUserSlotsModel(req.user?.id!);

    if (!slotsIncremented) {
      return next(createHttpError(500, "Failed to increment user slots"));
    }

    // Clear user cache after slot increment
    await redisClient.del(`user:${req.user?.id}`);

    return safeResponse(res, {
      status: 200,
      message: "Payment verified successfully",
      path: req.originalUrl,
      data: {
        verified: true,
        slotsAdded: 1,
      },
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Payment verification failed"));
  }
}
