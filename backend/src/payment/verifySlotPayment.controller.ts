import type { NextFunction, Request, Response } from "express";
import { verifySlotPaymentService } from "./verifySlotPayment.service.js";
import safeReject from "../utils/safeReject.js";

export async function verifySlotPaymentController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    return await verifySlotPaymentService(req, res, next);
  } catch (error) {
    console.log(error);
    return safeReject(res, {
      path: req.originalUrl,
      message: "Something went wrong",
      status: 500,
    });
  }
}
