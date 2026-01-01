import express from "express";
const userRouter = express.Router();
import { loginUser, register } from "./user.controller.js";

userRouter.post("/register", register);
userRouter.post("/login", loginUser);

export default userRouter;
