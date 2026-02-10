import { Permission, hasPermission } from "@/rbac/permissions";
import type { ROLE } from "@/rbac/roles";
import { getCurrentDashboardId } from "./getCurrentDashboardId";

export async function checkPermission({
  permission,
}: {
  permission: Permission;
}): Promise<{ allowed: boolean; role: ROLE | null }> {
  const dashboardId = await getCurrentDashboardId();
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/workspace/${dashboardId}/role`,
      {
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
