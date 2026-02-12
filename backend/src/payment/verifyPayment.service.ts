import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import crypto from "crypto";
import {
  getPaymentByOrderIdModel,
  updatePaymentRecordModel,
  updateWorkspacePlanModel,
} from "./payment.model.js";
import safeResponse from "../utils/safeResponse.js";
import { verifyPaymentSchema } from "./payment.validation.js";

export async function verifyPaymentService(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    workspaceId,
  } = req.body;

  const resData = await verifyPaymentSchema.safeParseAsync({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    workspaceId,
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

    if (paymentRecord.workspace_id !== resData.data.workspaceId) {
      return next(createHttpError(403, "Workspace mismatch"));
    }

    if (paymentRecord.user_id !== req.user?.id) {
      return next(createHttpError(403, "Unauthorized"));
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

    const workspaceUpdated = await updateWorkspacePlanModel(
      resData.data.workspaceId,
      paymentRecord.plan,
    );

    if (!workspaceUpdated) {
      return next(createHttpError(500, "Failed to update workspace plan"));
    }

    return safeResponse(res, {
      status: 200,
      message: "Payment verified successfully",
      path: req.originalUrl,
      data: {
        verified: true,
        plan: paymentRecord.plan,
      },
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Payment verification failed"));
  }
}
