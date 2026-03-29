import type { NextFunction, Request, Response } from "express";
import safeResponse from "../../utils/safeResponse.js";
import createHttpError from "http-errors";
import { checkSlugAvailabilityModel } from "../model/checkSlugAvailability.model.js";

export async function checkSlugAvailabilityController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const workspaceId = req.params.id;
    const slug = req.query.slug as string;

    if (!workspaceId) {
      return next(createHttpError(404, "Workspace not found"));
    }

    if (!slug) {
      return next(createHttpError(400, "Slug is required"));
    }

    const isAvailable = await checkSlugAvailabilityModel(slug, workspaceId);

    return safeResponse(res, {
      path: req.originalUrl,
      status: 200,
      message: isAvailable ? "Slug is available" : "Slug is already taken",
      data: { available: isAvailable },
    });
  } catch (error) {
    console.log(error);
    return next(createHttpError(500, "Something went wrong"));
  }
}
