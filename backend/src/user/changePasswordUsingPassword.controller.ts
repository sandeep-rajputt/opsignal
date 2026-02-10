import type { NextFunction, Request, Response } from "express";
import safeResponse from "../utils/safeResponse.js";
import { changePasswordUsingPasswordSchema } from "./changePasswordUsingPassword.validation.js";
import { changePasswordUsingPasswordService } from "./changePasswordUsingPassword.service.js";
import createHttpError from "http-errors";

export async function changePasswordUsingPasswordController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return next(createHttpError(401, "Unauthorized"));
    }

    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    const validation = await changePasswordUsingPasswordSchema.safeParseAsync({
      currentPassword,
      newPassword,
      confirmNewPassword,
    });

    if (!validation.success) {
      return next(
        createHttpError(
          400,
          "Validation failed. Some fields contain invalid or missing data.",
        ),
      );
    }

    const result = await changePasswordUsingPasswordService({
      userId,
      currentPassword: validation.data.currentPassword,
      newPassword: validation.data.newPassword,
    });

    if (!result.success) {
      return next(createHttpError(400, result.message));
    }

    return safeResponse(res, {
      path: req.originalUrl,
      status: 200,
      message: result.message,
      data: null,
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Something went wrong"));
  }
}
