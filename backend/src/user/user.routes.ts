import express from "express";
const userRouter = express.Router();
import { checkAuth, loginUser, register } from "./user.controller.js";
import ipRateLimiter from "../middlewares/ipRateLimiter.js";
import { verifyController } from "./user.controller.js";
import userAgentMiddleware from "../middlewares/userAgentMiddleware.js";
import authMiddleware from "../middlewares/auth.middleware.js";

userRouter.post(
  "/register",
  ipRateLimiter({
    maxRequests: 5,
    timeInMilliseconds: 60000,
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

userRouter.get("/me", authMiddleware, checkAuth);

export default userRouter;
