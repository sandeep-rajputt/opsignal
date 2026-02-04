import type { NextFunction, Request, Response } from "express";
import { getAllWorkspaceService } from "../service/workspace.controller.js";
import safeResponse from "../../utils/safeResponse.js";
import createHttpError from "http-errors";

async function getAllWorkspaceController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await getAllWorkspaceService(req.user?.id!);

    return safeResponse(res, {
      path: req.originalUrl,
      status: 200,
      message: "Successfully fetched workspaces",
      data,
    });
  } catch (error) {
    console.log(error);
    next(createHttpError(500));
  }
}

export default getAllWorkspaceController;
