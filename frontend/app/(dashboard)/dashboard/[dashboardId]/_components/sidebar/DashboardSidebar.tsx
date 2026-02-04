"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { WorkspaceSwitcher } from "@/app/(dashboard)/dashboard/[dashboardId]/_components/sidebar/WorkspaceSwitcher";
import SideUser from "@/app/(dashboard)/dashboard/[dashboardId]/_components/sidebar/SideUser";
import dynamic from "next/dynamic";

const ThemeSwitcher = dynamic(
  () =>
    import("@/app/(dashboard)/dashboard/[dashboardId]/_components/sidebar/ThemeSwitcher"),
  {
    ssr: false,
  },
);

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <WorkspaceSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <></>
      </SidebarContent>
      <SidebarFooter>
        <ThemeSwitcher />
        <SideUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
