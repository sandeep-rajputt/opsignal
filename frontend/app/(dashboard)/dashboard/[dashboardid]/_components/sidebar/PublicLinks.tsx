import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  CheckSquare,
  TrendingUp,
} from "lucide-react";
import { getCurrentDashboardId } from "@/lib/getCurrentDashboardId";
import { getPathname } from "@/lib/getPathname";

async function PublicLinks() {
  const workspaceId = await getCurrentDashboardId();
  const pathname = await getPathname();

  const isDashboard = pathname?.split("/").length === 3;
  const isIncidents =
    pathname?.split("/").length === 4 && pathname?.includes("incidents");
  const isTasks =
    pathname?.split("/").length === 4 && pathname?.includes("tasks");
  const isImprovements =
    pathname?.split("/").length === 4 && pathname?.includes("improvements");
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
          <SidebarMenuButton isActive={isIncidents} asChild={!isIncidents}>
            {isIncidents ? (
              <>
                <AlertTriangle /> Incidents
              </>
            ) : (
              <Link
                href={`/dashboard/${workspaceId}/incidents`}
                className="flex"
              >
                <AlertTriangle />
                Incidents
              </Link>
            )}
          </SidebarMenuButton>
          <SidebarMenuButton isActive={isTasks} asChild={!isTasks}>
            {isTasks ? (
              <>
                <CheckSquare /> Tasks
              </>
            ) : (
              <Link href={`/dashboard/${workspaceId}/tasks`} className="flex">
                <CheckSquare />
                Tasks
              </Link>
            )}
          </SidebarMenuButton>
          <SidebarMenuButton
            isActive={isImprovements}
            asChild={!isImprovements}
          >
            {isImprovements ? (
              <>
                <TrendingUp /> Improvements
              </>
            ) : (
              <Link
                href={`/dashboard/${workspaceId}/improvements`}
                className="flex"
              >
                <TrendingUp />
                Improvements
              </Link>
            )}
          </SidebarMenuButton>
          <SidebarMenuButton isActive={isMembers} asChild={!isMembers}>
            {isMembers ? (
              <>
                <Users /> Members
              </>
            ) : (
              <Link href={`/dashboard/${workspaceId}/members`} className="flex">
                <Users />
                Members
              </Link>
            )}
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default PublicLinks;
