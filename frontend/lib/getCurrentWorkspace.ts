import { cache } from "react";
import { cookies } from "next/headers";
import env from "@/config/env";
import { getCurrentDashboardId } from "./getCurrentDashboardId";
import type { ROLE } from "@/rbac/roles";

export interface WorkspaceData {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  role: ROLE | null;
  team?: string;
}

interface WorkspaceSuccessResponse {
  success: true;
  workspace: WorkspaceData;
  status: number;
}

interface WorkspaceFailResponse {
  success: false;
  workspace: null;
  status: number;
}

type WorkspaceResponse = WorkspaceFailResponse | WorkspaceSuccessResponse;

export const getCurrentWorkspace = cache(
  async (): Promise<WorkspaceResponse> => {
    try {
      const dashboardId = await getCurrentDashboardId();

      if (!dashboardId) {
        return { success: false, workspace: null, status: 500 };
      }

      const cookieStore = await cookies();

      const baseUrl =
        env.ENV === "development"
          ? env.BACKEND_DEVELOPMENT_URL
          : env.BACKEND_URL;

      const res = await fetch(
        `${baseUrl}/api/workspace/${dashboardId}/basic-info`,
        {
          method: "GET",
          headers: {
            cookie: cookieStore.toString(),
          },
          credentials: "include",
          cache: "no-store",
        },
      );

      if (!res.ok) {
        return { success: false, workspace: null, status: res.status };
      }

      const { data }: { data: WorkspaceData } = await res.json();

      return { success: true, workspace: data, status: res.status };
    } catch (error) {
      console.error("Workspace fetch error:", error);
      return { success: false, workspace: null, status: 500 };
    }
  },
);
