import { Permission, hasPermission } from "@/rbac/permissions";
import type { ROLE } from "@/rbac/roles";
import { cookies } from "next/headers";
import { getCurrentDashboardId } from "./getCurrentDashboardId";
import env from "@/config/env";

export async function checkPermission({
  permission,
}: {
  permission: Permission;
}): Promise<{ allowed: boolean; role: ROLE | null }> {
  const dashboardId = await getCurrentDashboardId();
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.toString();

  const baseUrl =
    env.ENV === "development" ? env.BACKEND_DEVELOPMENT_URL : env.BACKEND_URL;

  try {
    const response = await fetch(
      `${baseUrl}/api/workspace/${dashboardId}/role`,
      {
        headers: {
          Cookie: cookieHeader,
          "Content-Type": "application/json",
        },
        credentials: "include",
        cache: "no-store",
      },
    );

    if (!response.ok) {
      return { allowed: false, role: null };
    }

    const data = await response.json();
    const userRole = data.message as ROLE;

    const allowed = hasPermission({ role: userRole, permission });

    return { allowed, role: userRole };
  } catch (error) {
    console.error("Permission check failed:", error);
    return { allowed: false, role: null };
  }
}
