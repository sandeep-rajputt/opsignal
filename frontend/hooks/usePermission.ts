"use client";

import { useParams } from "next/navigation";
import { useGetUserRoleQuery } from "@/Store/api/getUserRoleApi/getUserRoleApi";
import { Permission, hasPermission } from "@/rbac/permissions";
import type { ROLE } from "@/rbac/roles";

export function usePermission(permission: Permission) {
  const params = useParams();
  const dashboardId = params.dashboardId as string;

  const { data, isLoading, error } = useGetUserRoleQuery(dashboardId, {
    skip: !dashboardId,
  });

  const userRole = data?.message as ROLE | undefined;

  const allowed = userRole
    ? hasPermission({ role: userRole, permission })
    : false;

  return {
    allowed,
    isLoading,
    error,
    role: userRole,
  };
}
