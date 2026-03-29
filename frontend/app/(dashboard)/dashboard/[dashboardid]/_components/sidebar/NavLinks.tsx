"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  CheckSquare,
  TrendingUp,
  Settings,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/rbac/permissions";

function NavLinks({ workspaceId }: { workspaceId: string }) {
  const pathname = usePathname();
  const { allowed: canEditWorkspace } = usePermission(
    Permission.EDIT_WORKSPACE,
  );

  const isDashboard = pathname?.split("/").length === 3;
  const isIncidents =
    pathname?.split("/").length === 4 && pathname?.includes("incidents");
  const isTasks =
    pathname?.split("/").length === 4 && pathname?.includes("tasks");
  const isImprovements =
    pathname?.split("/").length === 4 && pathname?.includes("improvements");
  const isMembers =
    pathname?.split("/").length === 4 && pathname?.includes("members");
  const isSettings =
    pathname?.split("/").length === 4 && pathname?.includes("settings");

  const links = [
    {
      href: `/dashboard/${workspaceId}`,
      label: "Dashboard",
      icon: LayoutDashboard,
      isActive: isDashboard,
      show: true,
    },
    {
      href: `/dashboard/${workspaceId}/incidents`,
      label: "Incidents",
      icon: AlertTriangle,
      isActive: isIncidents,
      show: true,
    },
    {
      href: `/dashboard/${workspaceId}/tasks`,
      label: "Tasks",
      icon: CheckSquare,
      isActive: isTasks,
      show: true,
    },
    {
      href: `/dashboard/${workspaceId}/improvements`,
      label: "Improvements",
      icon: TrendingUp,
      isActive: isImprovements,
      show: true,
    },
    {
      href: `/dashboard/${workspaceId}/members`,
      label: "Members",
      icon: Users,
      isActive: isMembers,
      show: true,
    },
    {
      href: `/dashboard/${workspaceId}/settings`,
      label: "Settings",
      icon: Settings,
      isActive: isSettings,
      show: canEditWorkspace,
    },
  ];

  return (
    <>
      {links
        .filter((link) => link.show)
        .map(({ href, label, icon: Icon, isActive }) => (
          <SidebarMenuItem key={label}>
            <SidebarMenuButton isActive={isActive} asChild={!isActive}>
              {isActive ? (
                <>
                  <Icon /> {label}
                </>
              ) : (
                <Link href={href} className="flex">
                  <Icon /> {label}
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
    </>
  );
}

export default NavLinks;
