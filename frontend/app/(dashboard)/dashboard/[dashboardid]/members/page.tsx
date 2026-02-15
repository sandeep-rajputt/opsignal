import AddWorkspaceMemberButton from "@/components/shared/addWorkspaceMemberButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { checkPermission } from "@/lib/checkPermission";
import { Permission } from "@/rbac/permissions";

async function MembersPage() {
  return (
    <div>
      <header className="flex items-center justify-between w-full px-5 py-4">
        <div className="flex gap-5 items-center">
          <SidebarTrigger />
          <h1>Members</h1>
        </div>

        {/* add member in any team */}
        {(await checkPermission({
          permission: Permission.ADD_WORKSPACE_MEMBER,
        })) && <AddWorkspaceMemberButton />}
      </header>
    </div>
  );
}

export default MembersPage;
