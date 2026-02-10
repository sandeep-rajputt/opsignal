import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import updateProfileSchema from "./updateProfile.validation.js";
import { updateProfileService } from "./updateProfile.service.js";
import safeResponse from "../utils/safeResponse.js";

export async function updateProfileController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { name, avatarUrl, avatarPublicId } = req.body;

    const data = await updateProfileSchema.safeParseAsync({
      name,
      avatarUrl,
      avatarPublicId,
    });

    if (!data.success) {
      return next(
        createHttpError(
          400,
          "Validation failed. Some fields contain invalid or missing data.",
        ),
      );
    }

    const result = await updateProfileService(
      req.user?.id!,
      data.data.name,
      data.data.avatarUrl,
      data.data.avatarPublicId,
    );

    return safeResponse(res, {
      status: 200,
      message: "Profile updated successfully",
      path: req.originalUrl,
      data: {
        id: result.id,
        name: result.name,
        avatarUrl: result.avatarurl,
      },
    });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Something went wrong"));
  }
}
