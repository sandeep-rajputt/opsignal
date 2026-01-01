import type { ApiResponse } from "../types/apiResponse.js";
import type { Response } from "express";

function safeResponse(res: Response, data: ApiResponse) {
  return res.status(data.status).json({
    ...data,
    timeStamp: Date.now(),
  });
}

export default safeResponse;
