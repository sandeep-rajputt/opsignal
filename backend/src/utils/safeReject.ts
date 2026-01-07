import type { ApiRejectResponse } from "../types/apiRejectResponse.js";
import type { Response } from "express";

function safeReject(res: Response, data: ApiRejectResponse) {
  return res.status(data.status).json({ ...data, timestamp: Date.now() });
}

export default safeReject;
