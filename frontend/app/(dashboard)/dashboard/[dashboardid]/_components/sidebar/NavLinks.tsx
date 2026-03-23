"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  CheckSquare,
  TrendingUp,
} from "lucide-react";
import { usePathname } from "next/navigation";

function NavLinks({ workspaceId }: { workspaceId: string }) {
  const pathname = usePathname();

  const isDashboard = pathname?.split("/").length === 3;
  const isIncidents =
    pathname?.split("/").length === 4 && pathname?.includes("incidents");
  const isTasks =
    pathname?.split("/").length === 4 && pathname?.includes("tasks");
  const isImprovements =
    pathname?.split("/").length === 4 && pathname?.includes("improvements");
  const isMembers =
    pathname?.split("/").length === 4 && pathname?.includes("members");

  const links = [
    {
      href: `/dashboard/${workspaceId}`,
      label: "Dashboard",
      icon: LayoutDashboard,
      isActive: isDashboard,
    },
    {
      href: `/dashboard/${workspaceId}/incidents`,
      label: "Incidents",
      icon: AlertTriangle,
      isActive: isIncidents,
    },
    {
      href: `/dashboard/${workspaceId}/tasks`,
      label: "Tasks",
      icon: CheckSquare,
      isActive: isTasks,
    },
    {
      href: `/dashboard/${workspaceId}/improvements`,
      label: "Improvements",
      icon: TrendingUp,
      isActive: isImprovements,
    },
    {
      href: `/dashboard/${workspaceId}/members`,
      label: "Members",
      icon: Users,
      isActive: isMembers,
    },
  ];

  return (
    <>
      {links.map(({ href, label, icon: Icon, isActive }) => (
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
