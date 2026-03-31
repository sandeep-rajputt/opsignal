import express from "express";
const paymentRouter = express.Router();
import authMiddleware from "../middlewares/auth.middleware.js";
import rateLimiter from "../middlewares/rateLimiter.js";
import { createOrderController } from "./createOrder.controller.js";
import { verifyPaymentController } from "./verifyPayment.controller.js";
import { createSlotOrderController } from "./createSlotOrder.controller.js";
import { verifySlotPaymentController } from "./verifySlotPayment.controller.js";

paymentRouter.post(
  "/create-order",
  authMiddleware,
  rateLimiter({
    maxRequests: 10,
    timeInSeconds: 60 * 60,
    path: "create-order",
  }),
  createOrderController,
);

paymentRouter.post(
  "/create-slot-order",
  authMiddleware,
  rateLimiter({
    maxRequests: 10,
    timeInSeconds: 60 * 60,
    path: "create-slot-order",
  }),
  createSlotOrderController,
);

paymentRouter.post(
  "/verify-payment",
  authMiddleware,
  rateLimiter({
    maxRequests: 10,
    timeInSeconds: 60 * 60,
    path: "verify-payment",
  }),
  verifyPaymentController,
);

paymentRouter.post(
  "/verify-slot-payment",
  authMiddleware,
  rateLimiter({
    maxRequests: 10,
    timeInSeconds: 60 * 60,
    path: "verify-slot-payment",
  }),
  verifySlotPaymentController,
);

export default paymentRouter;
