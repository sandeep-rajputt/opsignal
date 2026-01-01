import type { Request, Response } from "express";
import { createUserSchema, loginUserSchema } from "./user.validation.js";
import safeReject from "../utils/safeReject.js";
import { createUser, loginUser as loginUserService } from "./user.service.js";
import safeResponse from "../utils/safeResponse.js";

export async function register(req: Request, res: Response) {
  try {
    const { name, email, password, confirmPassword } = req.body;
    const data = await createUserSchema.safeParseAsync({
      name,
      email,
      password,
      confirmPassword,
    });
    if (!data.success) {
      return safeReject(res, {
        status: 400,
        message:
          "Validation failed. Some fields contain invalid or missing data.",
        path: req.originalUrl,
      });
    }

    const resData = await createUser(data.data);

    return safeResponse(res, {
      status: 201,
      message: "Account created successfully.",
      path: req.originalUrl,
      data: resData,
    });
  } catch (err: any) {
    console.log(err);
    if (err?.constraint === "users_email_key") {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Email already exist",
        status: 400,
      });
    }
    return safeReject(res, {
      path: req.originalUrl,
      message: "Something went wrong",
      status: 500,
    });
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const data = await loginUserSchema.safeParseAsync({ email, password });
    if (!data.success) {
      return safeReject(res, {
        status: 400,
        message:
          "Validation failed. Some fields contain invalid or missing data.",
        path: req.originalUrl,
      });
    }
    const resData = await loginUserService(data.data);
    if (!resData.success) {
      return safeReject(res, {
        status: 400,
        message: resData.message,
        path: req.originalUrl,
      });
    }

    return safeResponse(res, {
      status: 200,
      message: "Logged in successfully.",
      path: req.originalUrl,
      data: null,
    });
  } catch {
    return safeReject(res, {
      path: req.originalUrl,
      message: "Something went wrong",
      status: 500,
    });
  }
}
