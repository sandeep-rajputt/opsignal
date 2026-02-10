import { cache } from "react";
import { cookies } from "next/headers";
import env from "@/config/env";
import type { UserRole } from "@/schemas/common/roleSchema";

interface GetUserRoleSuccessResponse {
  success: true;
  role: UserRole;
}

interface GetUserRoleFailResponse {
  success: false;
  role: null;
}

type GetUserRoleResponse = GetUserRoleFailResponse | GetUserRoleSuccessResponse;

export const getUserRole = cache(
  async (workspaceId: string): Promise<GetUserRoleResponse> => {
    try {
      const cookieStore = await cookies();

      const baseUrl =
        env.ENV === "development"
          ? env.BACKEND_DEVELOPMENT_URL
          : env.BACKEND_URL;

      const res = await fetch(`${baseUrl}/api/workspace/${workspaceId}/role`, {
        method: "GET",
        headers: {
          cookie: cookieStore.toString(),
        },
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        return { success: false, role: null };
      }

      const data = await res.json();
      const userRole = data.message as UserRole;

      return { success: true, role: userRole };
    } catch (error) {
      console.error("Get user role error:", error);
      return { success: false, role: null };
    }
  },
);
