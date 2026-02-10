import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import uploadSignatureSchema from "./uploadSignature.validation.js";
import { generateUploadSignatureService } from "./uploadSignature.service.js";
import safeResponse from "../utils/safeResponse.js";

export async function uploadSignatureController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { folder } = req.body;

    const data = await uploadSignatureSchema.safeParseAsync({ folder });

    if (!data.success) {
      return next(
        createHttpError(
          400,
          "Validation failed. Some fields contain invalid or missing data.",
        ),
      );
    }

    const signatureData = await generateUploadSignatureService(
      data.data.folder,
    );

    return safeResponse(res, {
      status: 200,
      message: "Signature generated successfully",
      path: req.originalUrl,
      data: signatureData,
    });
  } catch (error) {
    console.error(error);
    return next(createHttpError(500, "Something went wrong"));
  }
}
