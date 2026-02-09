import { headers } from "next/headers";
import { cache } from "react";

export const getPathname = cache(async (): Promise<string | null> => {
  try {
    const headersList = await headers();
    const pathname = headersList.get("x-pathname");

    if (pathname) {
      return pathname;
    }

    return null;
  } catch (error) {
    console.error("Error getting pathname:", error);
    return null;
  }
});
