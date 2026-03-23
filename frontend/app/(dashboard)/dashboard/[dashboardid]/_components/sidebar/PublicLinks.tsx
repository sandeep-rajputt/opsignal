import { SidebarGroup, SidebarMenu } from "@/components/ui/sidebar";
import { getCurrentDashboardId } from "@/lib/getCurrentDashboardId";
import NavLinks from "./NavLinks";

async function PublicLinks() {
  const workspaceId = await getCurrentDashboardId();

  if (!workspaceId) return null;

  return (
    <SidebarGroup>
      <SidebarMenu className="flex flex-col gap-1">
        <NavLinks workspaceId={workspaceId} />
      </SidebarMenu>
    </SidebarGroup>
  );
}

export default PublicLinks;
