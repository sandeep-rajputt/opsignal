import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { type ApiError } from "@/types/apiError";

function isApiError(error: unknown): ApiError | null {
  if (error && typeof error === "object" && "status" in error) {
    const fetchError = error as FetchBaseQueryError;
    return fetchError.data as ApiError;
  }
  return null;
}

export default isApiError;
