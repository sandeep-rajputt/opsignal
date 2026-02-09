import { headers } from "next/headers";
import { cache } from "react";

export const getCurrentDashboardId = cache(async (): Promise<string | null> => {
  try {
    const headersList = await headers();

    const dashboardId = headersList.get("x-dashboard-id");

    if (dashboardId) {
      return dashboardId;
    }

    return null;
  } catch (error) {
    console.error("Error getting dashboard ID:", error);
    return null;
  }
});
