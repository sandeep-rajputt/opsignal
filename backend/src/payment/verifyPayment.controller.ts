import type { NextFunction, Request, Response } from "express";
import { verifyPaymentService } from "./verifyPayment.service.js";
import safeReject from "../utils/safeReject.js";

export async function verifyPaymentController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    return await verifyPaymentService(req, res, next);
  } catch (error) {
    console.log(error);
    return safeReject(res, {
      path: req.originalUrl,
      message: "Something went wrong",
      status: 500,
    });
  }
}
