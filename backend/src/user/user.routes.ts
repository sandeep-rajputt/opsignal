import express from "express";
const userRouter = express.Router();
import {
  getUser,
  checkChangePasswordToken,
  loginUser,
  register,
  resetPassword,
  changeUserPassword,
} from "./user.controller.js";
import ipRateLimiter from "../middlewares/ipRateLimiter.js";
import { verifyController } from "./user.controller.js";
import userAgentMiddleware from "../middlewares/userAgentMiddleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

userRouter.post(
  "/register",
  ipRateLimiter({
    maxRequests: 5,
    timeInMilliseconds: 3 * 60 * 60 * 1000,
    path: "register",
  }),
  userAgentMiddleware,
  register,
);

userRouter.post(
  "/login",
  ipRateLimiter({
    maxRequests: 5,
    timeInMilliseconds: 60000,
    path: "login",
  }),
  userAgentMiddleware,
  loginUser,
);

userRouter.get(
  "/verify",
  ipRateLimiter({
    maxRequests: 5,
    timeInMilliseconds: 60000,
    path: "verify",
  }),
  verifyController,
);

userRouter.post(
  "/reset-password",
  ipRateLimiter({
    maxRequests: 5,
    timeInMilliseconds: 3 * 60 * 60 * 1000,
    path: "reset-password",
  }),
  resetPassword,
);

userRouter.post(
  "/check-change-password-token",
  ipRateLimiter({
    maxRequests: 5,
    timeInMilliseconds: 60 * 60 * 1000,
    path: "check-change-password-token",
  }),
  checkChangePasswordToken,
);

userRouter.post(
  "/change-user-password",
  ipRateLimiter({
    maxRequests: 5,
    timeInMilliseconds: 60 * 60 * 1000,
    path: "change-user-password",
  }),
  changeUserPassword,
);

userRouter.get("/me", authMiddleware, getUser);

export default userRouter;
