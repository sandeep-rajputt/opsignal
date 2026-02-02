import { HttpError } from "http-errors";
import type { Request, Response, NextFunction } from "express";
import config from "../config/config.js";
import safeReject from "../utils/safeReject.js";
import type { ApiRejectResponse } from "../types/apiRejectResponse.js";

function globalErrorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const statusCode = err.statusCode || 500;

  const errorResponse: ApiRejectResponse = {
    message: err.message || "Something went wrong",
    status: statusCode,
    path: req.originalUrl,
    data:
      config.ENV === "development"
        ? {
            stack: err.stack || "No stack trace available",
          }
        : undefined,
  };

  return safeReject(res, errorResponse);
}

export default globalErrorHandler;
