import type { NextFunction, Request, Response } from "express";
import { createSlotOrderService } from "./createSlotOrder.service.js";
import safeReject from "../utils/safeReject.js";

export async function createSlotOrderController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    return await createSlotOrderService(req, res, next);
  } catch (error) {
    console.log(error);
    return safeReject(res, {
      path: req.originalUrl,
      message: "Something went wrong",
      status: 500,
    });
  }
}
