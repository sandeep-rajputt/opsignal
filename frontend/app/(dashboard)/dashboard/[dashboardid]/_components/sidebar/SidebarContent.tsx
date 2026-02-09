import PublicLinks from "./PublicLinks";
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";
import SideUser from "./SideUser";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import ThemeSwitcher from "./ThemeSwitcher";
import { getCurrentWorkspace } from "@/lib/getCurrentWorkspace";

async function SidebarCustomContent() {
  const { workspace } = await getCurrentWorkspace();

  return (
    <>
      <SidebarHeader>
        <WorkspaceSwitcher />
      </SidebarHeader>

      <SidebarContent>
        {!workspace || (workspace && workspace.role === null) ? (
          <></>
        ) : (
          <PublicLinks />
        )}
      </SidebarContent>

      <SidebarFooter>
        <ThemeSwitcher />
        <SideUser />
      </SidebarFooter>
      <SidebarRail />
    </>
  );
}

export default SidebarCustomContent;
