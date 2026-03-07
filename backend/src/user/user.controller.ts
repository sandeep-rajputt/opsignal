import type { NextFunction, Request, Response } from "express";
import {
  createUserSchema,
  loginUserSchema,
  changeUserPasswordSchema,
} from "./user.validation.js";
import safeReject from "../utils/safeReject.js";
import {
  checkUserExistByIdService,
  createSession,
  createUser,
  getUserIdByEmailService,
  loginUser as loginUserService,
  verifyUser,
  changeUserPasswordService,
  logoutUserService,
} from "./user.service.js";
import safeResponse from "../utils/safeResponse.js";
import enqueueEmail from "../jobs/queues/email.queue.js";
import { createToken, verifyToken } from "../utils/jwt.js";
import config from "../config/config.js";
import redisClient from "../config/redis.js";
import addAccessToken from "../utils/addAccessToken.js";
import addRefreshToken from "../utils/addRefreshToken.js";
import { updateRefreshTokenInDb } from "../utils/refreshAccessToken.js";
import emailSchema from "../schemas/common/emailSchema.js";
import { v4 as uuidv4 } from "uuid";
import { getUserModel } from "./users.model.js";
import createHttpError from "http-errors";

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

    await enqueueEmail({
      from: "Opsignal <i@opsignal.sandeeprajput.in>",
      to: email,
      emailType: {
        name: "verifyEmail",
        params: {
          link: `${config.FRONTEND_URL}/verify?token=${token}`,
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
  console.log("req recieved");
  try {
    if (req.cookies.refresh_token) {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Already logged in",
        status: 400,
      });
    }
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

    const sessionId = await createSession({ req, id: resData.id });

    const refreshToken = createToken({
      key: config.REFRESH_TOKEN_SECRET,
      data: { id: resData.id, sessionId: sessionId.id },
      expiresIn: "7d",
    });

    // update the refresh token in db
    await updateRefreshTokenInDb(refreshToken);

    // add refresh token in cookie
    addRefreshToken({ res, id: null, sessionId: null, token: refreshToken });

    // add access token in cookie
    addAccessToken({ res, id: resData.id, token: null });

    return safeResponse(res, {
      status: 200,
      message: "Logged in successfully.",
      path: req.originalUrl,
      data: {
        id: resData.id,
        name: resData.name,
        email: data.data.email,
        timezone: resData.timezone,
        workspace: resData.workspaceId,
        avatarUrl: resData.avatarUrl,
      },
    });
  } catch (error) {
    console.log(error);
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

    const tokenVerifyRes = verifyToken({
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

export async function resetPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    const resData = await emailSchema.safeParseAsync(email);
    if (!resData.success) {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Invalid email address",
        status: 400,
      });
    }

    const data = await getUserIdByEmailService(resData.data);

    if (!data?.id) {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Email address not found",
        status: 400,
      });
    }

    const token = createToken({
      key: config.RESET_PASSWORD_TOKEN,
      data: { id: data.id },
      expiresIn: "1h",
    });

    const redisId = uuidv4();

    await redisClient.set(redisId, data.id, "EX", 60 * 60 * 1000);

    await enqueueEmail({
      from: "Opsignal <i@opsignal.sandeeprajput.in>",
      to: resData.data,
      emailType: {
        name: "resetPasswordEmail",
        params: {
          link: `${config.FRONTEND_URL}/change-password?token=${token}&id=${redisId}`,
        },
      },
    });
    return safeResponse(res, {
      path: req.originalUrl,
      message: "Email sent successfully",
      data: null,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return safeReject(res, {
      path: req.originalUrl,
      message: "Something went wrong",
      status: 500,
    });
  }
}

export async function checkChangePasswordToken(req: Request, res: Response) {
  try {
    const { token, id } = req.body;
    const redisId = await redisClient.get(id);
    if (!redisId) {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Requested link is invalid or expired",
        status: 400,
      });
    }

    const tokenResult = verifyToken({
      token,
      secret: config.RESET_PASSWORD_TOKEN,
    });

    if (!tokenResult.success) {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Requested link is invalid",
        status: 400,
      });
    }

    if (redisId !== tokenResult.data.id) {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Requested link is invalid",
        status: 400,
      });
    }

    const userExist = await checkUserExistByIdService(redisId);

    if (!userExist) {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Requested link is invalid",
        status: 400,
      });
    }

    return safeResponse(res, {
      path: req.originalUrl,
      message: "Password chnaged successfully",
      data: null,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return safeReject(res, {
      path: req.originalUrl,
      message: "Something went wrong",
      status: 500,
    });
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const redisData = await redisClient.get(`user:${req.user?.id}`);
    if (redisData) {
      return safeResponse(res, {
        status: 200,
        message: "You are here",
        path: "/me",
        data: JSON.parse(redisData),
      });
    }

    const user = await getUserModel(req.user?.id!);

    if (!user) {
      next(createHttpError(400, "User Not found"));
    }

    const data = {
      id: user?.id,
      name: user?.name,
      timezone: user?.timezone,
      workspace: user?.workspace,
      email: user?.email,
      avatarUrl: user?.avatarurl,
      slots: user?.slots,
    };

    await redisClient.set(
      `user:${req.user?.id}`,
      JSON.stringify(data),
      "EX",
      5 * 60,
    );

    return safeResponse(res, {
      status: 200,
      message: "You are here",
      path: "/me",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return safeReject(res, {
      path: req.originalUrl,
      message: "Something went wrong",
      status: 500,
    });
  }
}

export async function changeUserPassword(req: Request, res: Response) {
  try {
    const { token, id, newPassword, confirmNewPassword } = req.body;

    const data = await changeUserPasswordSchema.safeParseAsync({
      token,
      id,
      newPassword,
      confirmNewPassword,
    });

    if (!data.success) {
      return safeReject(res, {
        status: 400,
        message:
          "Validation failed. Some fields contain invalid or missing data.",
        path: req.originalUrl,
      });
    }

    const redisId = await redisClient.get(data.data.id);
    if (!redisId) {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Requested link is invalid or expired",
        status: 400,
      });
    }

    const tokenResult = verifyToken({
      token: data.data.token,
      secret: config.RESET_PASSWORD_TOKEN,
    });

    if (!tokenResult.success) {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Requested link is invalid",
        status: 400,
      });
    }

    if (redisId !== tokenResult.data.id) {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Requested link is invalid",
        status: 400,
      });
    }

    const userExists = await checkUserExistByIdService(redisId);
    if (!userExists) {
      return safeReject(res, {
        path: req.originalUrl,
        message: "Requested link is invalid",
        status: 400,
      });
    }

    await changeUserPasswordService(redisId, data.data.newPassword);

    await redisClient.del(data.data.id);

    return safeResponse(res, {
      path: req.originalUrl,
      message: "Password changed successfully",
      data: null,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return safeReject(res, {
      path: req.originalUrl,
      message: "Something went wrong",
      status: 500,
    });
  }
}

export async function logoutUser(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    await logoutUserService(req, res, next);
    return safeResponse(res, {
      path: req.originalUrl,
      message: "Logout successfully",
      data: null,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return safeReject(res, {
      path: req.originalUrl,
      message: "Something went wrong",
      status: 500,
    });
  }
}
