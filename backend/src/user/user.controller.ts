import type { Request, Response } from "express";
import { createUserSchema, loginUserSchema } from "./user.validation.js";
import safeReject from "../utils/safeReject.js";
import {
  createSession,
  createUser,
  loginUser as loginUserService,
  verifyUser,
} from "./user.service.js";
import safeResponse from "../utils/safeResponse.js";
import enqueueEmail from "../jobs/queues/email.queue.js";
import { createToken, verifyToken } from "../utils/jwt.js";
import config from "../config/config.js";
import redisClient from "../config/redis.js";

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

    if (!resData?.id) {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Something went wrong",
        status: 500,
      });
    }

    const token = createToken({
      key: config.EMAIL_VERIFY_JWT_TOKEN,
      data: { id: resData.id },
      expiresIn: "3h",
    });

    if (!token.success) {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Something went wrong",
        status: 500,
      });
    }

    await createSession({ req, id: resData.id });

    await enqueueEmail({
      from: "Opsignal <i@opsignal.sandeeprajput.in>",
      to: email,
      emailType: {
        name: "verifyEmail",
        params: {
          link: `${config.FRONTEND_URL.split(",")[0]}/verify?token=${token.data}`,
        },
      },
    });

    return safeResponse(res, {
      status: 201,
      message: "Account created successfully.",
      path: req.originalUrl,
      data: resData,
    });
  } catch (err: any) {
    console.error(err);
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

    const accessToken = createToken({
      key: config.LOGIN_JWT_TOKEN_KEY,
      data: { id: resData.id },
      expiresIn: "15m",
    });

    if (accessToken.success) {
      return safeResponse(res, {
        status: 200,
        message: "Logged in successfully.",
        path: req.originalUrl,
        data: { token: accessToken.data },
      });
    }

    if (accessToken.error) {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Something went wrong",
        status: 500,
      });
    }
  } catch {
    return safeReject(res, {
      path: req.originalUrl,
      message: "Something went wrong",
      status: 500,
    });
  }
}

export async function verifyController(req: Request, res: Response) {
  try {
    const token = req.query.token;

    if (!token) {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Invalid or missing verification token",
        status: 400,
      });
    }

    const tokenVerifyRes = await verifyToken({
      token: String(token),
      secret: config.EMAIL_VERIFY_JWT_TOKEN,
    });

    if (!tokenVerifyRes.success) {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Verification link is invalid or expired",
        status: 401,
      });
    }
    const redisRes = await redisClient.get(
      `users:verify:${tokenVerifyRes.data.id}`,
    );

    if (redisRes) {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Email already verified",
        status: 409,
      });
    }
    await verifyUser(tokenVerifyRes.data.id as string);

    await redisClient.set(
      `users:verify:${tokenVerifyRes.data.id}`,
      "true",
      "EX",
      60 * 60 * 3,
    );

    return safeResponse(res, {
      path: req.originalUrl,
      message: "Email verified successfully",
      data: null,
      status: 204,
    });
  } catch {
    return safeReject(res, {
      path: req.originalUrl,
      message: "Something went wrong",
      status: 500,
    });
  }
}
