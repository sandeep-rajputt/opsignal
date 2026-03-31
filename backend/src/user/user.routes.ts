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
import rateLimiter from "../middlewares/rateLimiter.js";
import { verifyController } from "./user.controller.js";
import userAgentMiddleware from "../middlewares/userAgentMiddleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import { logoutUser } from "./user.controller.js";
import { getUserSessionsController } from "./getUserSessions.controller.js";
import { revokeSessionController } from "./revokeSession.controller.js";
import { changePasswordUsingPasswordController } from "./changePasswordUsingPassword.controller.js";
import { uploadSignatureController } from "./uploadSignature.controller.js";
import { updateProfileController } from "./updateProfile.controller.js";

userRouter.post(
  "/register",
  ipRateLimiter({
    maxRequests: 5,
    timeInSeconds: 3 * 60 * 60,
    path: "register",
  }),
  userAgentMiddleware,
  register,
);

userRouter.post(
  "/login",
  ipRateLimiter({
    maxRequests: 5,
    timeInSeconds: 60 * 60 * 3,
    path: "login",
  }),
  userAgentMiddleware,
  loginUser,
);

userRouter.get(
  "/verify",
  ipRateLimiter({
    maxRequests: 5,
    timeInSeconds: 60 * 60 * 3,
    path: "verify",
  }),
  verifyController,
);

userRouter.post(
  "/reset-password",
  ipRateLimiter({
    maxRequests: 5,
    timeInSeconds: 3 * 60 * 60,
    path: "reset-password",
  }),
  resetPassword,
);

userRouter.post(
  "/check-change-password-token",
  ipRateLimiter({
    maxRequests: 5,
    timeInSeconds: 60 * 60,
    path: "check-change-password-token",
  }),
  checkChangePasswordToken,
);

userRouter.post(
  "/change-user-password",
  ipRateLimiter({
    maxRequests: 5,
    timeInSeconds: 60 * 60 * 1000,
    path: "change-user-password",
  }),
  changeUserPassword,
);

userRouter.post(
  "/logout",
  ipRateLimiter({
    maxRequests: 1,
    timeInSeconds: 1000,
    path: "logout",
  }),
  logoutUser,
);

userRouter.get(
  "/me",
  authMiddleware,
  rateLimiter({
    maxRequests: 30,
    timeInSeconds: 60,
    path: "get-user",
  }),
  getUser,
);

userRouter.get(
  "/sessions",
  authMiddleware,
  rateLimiter({
    maxRequests: 30,
    timeInSeconds: 60,
    path: "get-sessions",
  }),
  getUserSessionsController,
);

userRouter.delete(
  "/sessions/:sessionId",
  authMiddleware,
  rateLimiter({
    maxRequests: 10,
    timeInSeconds: 60,
    path: "revoke-session",
  }),
  revokeSessionController,
);

userRouter.post(
  "/change-pass-using-password",
  authMiddleware,
  rateLimiter({
    maxRequests: 5,
    timeInSeconds: 60 * 60,
    path: "change-pass-using-password",
  }),
  changePasswordUsingPasswordController,
);

userRouter.post(
  "/upload-signature",
  authMiddleware,
  rateLimiter({
    maxRequests: 10,
    timeInSeconds: 60 * 60,
    path: "upload-signature",
  }),
  uploadSignatureController,
);

userRouter.post(
  "/update-profile",
  authMiddleware,
  rateLimiter({
    maxRequests: 10,
    timeInSeconds: 60 * 60,
    path: "update-profile",
  }),
  updateProfileController,
);

export default userRouter;
