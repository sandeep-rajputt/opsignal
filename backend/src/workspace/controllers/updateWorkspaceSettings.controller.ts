import type { NextFunction, Request, Response } from "express";
import safeResponse from "../../utils/safeResponse.js";
import createHttpError from "http-errors";
import { updateWorkspaceSettingsService } from "../service/updateWorkspaceSettings.service.js";
import updateWorkspaceSettingsSchema from "../validation/updateWorkspaceSettings.validation.js";

export async function updateWorkspaceSettingsController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const workspaceId = req.params.id;
    if (!workspaceId) {
      return next(createHttpError(404, "Workspace not found"));
    }

    const userId = req.user?.id;
    if (!userId) {
      return next(createHttpError(401, "Authentication required"));
    }

    const validationResult = updateWorkspaceSettingsSchema.safeParse(req.body);
    if (!validationResult.success) {
      const errorMessage =
        validationResult.error.issues[0]?.message || "Invalid input";
      return next(createHttpError(400, errorMessage));
    }

    const { name, description, logoUrl, logoPublicId, slug } =
      validationResult.data;

    const result = await updateWorkspaceSettingsService({
      workspaceId,
      userId,
      name,
      description,
      logoUrl,
      logoPublicId,
      slug,
    });

    return safeResponse(res, {
      path: req.originalUrl,
      status: 200,
      message: "Workspace settings updated successfully",
      data: result,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      if (
        error.message.includes("permission") ||
        error.message.includes("premium") ||
        error.message.includes("taken")
      ) {
        return next(createHttpError(403, error.message));
      }
    }
    return next(createHttpError(500, "Something went wrong"));
  }
}
