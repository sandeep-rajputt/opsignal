import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { LayoutDashboard, Users } from "lucide-react";
import { getCurrentDashboardId } from "@/lib/getCurrentDashboardId";
import { getPathname } from "@/lib/getPathname";

async function PublicLinks() {
  const workspaceId = await getCurrentDashboardId();
  const pathname = await getPathname();

  const isDashboard = pathname?.split("/").length === 3;
  const isMembers =
    pathname?.split("/").length === 4 && pathname?.includes("members");

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem className="flex flex-col gap-1">
          <SidebarMenuButton isActive={isDashboard} asChild={!isDashboard}>
            {isDashboard ? (
              <>
                <LayoutDashboard /> Dashboard
              </>
            ) : (
              <Link href={`/dashboard/${workspaceId}`} className="flex">
                <LayoutDashboard /> Dashboard
              </Link>
            )}
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <Link href={`/dashboard/${workspaceId}/incidents`} className="flex">
              <Users />
              Incidents
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <Link href={`/dashboard/${workspaceId}/members`} className="flex">
              <Users />
              Members
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default PublicLinks;
