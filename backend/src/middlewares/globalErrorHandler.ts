import { HttpError } from "http-errors";
import type { Request, Response, NextFunction } from "express";
import config from "../config/config.js";

function globalErrorHandler(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const statusCode = err.statusCode || 500;

  return res.status(statusCode).json({
    success: false,
    message: err.message,
    timeStamp: Date.now(),
    errorStack:
      config.ENV === "development"
        ? err.stack || "Something went wrong"
        : "Something went wrong",
  });
}

export default globalErrorHandler;
