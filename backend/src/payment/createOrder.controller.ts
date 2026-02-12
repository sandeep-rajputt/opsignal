import type { NextFunction, Request, Response } from "express";
import { createOrderService } from "./createOrder.service.js";
import safeReject from "../utils/safeReject.js";

export async function createOrderController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    return await createOrderService(req, res, next);
  } catch (error) {
    console.log(error);
    return safeReject(res, {
      path: req.originalUrl,
      message: "Something went wrong",
      status: 500,
    });
  }
}
