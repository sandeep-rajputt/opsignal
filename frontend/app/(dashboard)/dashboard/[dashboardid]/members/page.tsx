import AddWorkspaceMemberButton from "@/components/shared/addWorkspaceMemberButton";
import AddTeamMemberButton from "@/components/shared/addTeamMemberButton";
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

        <div className="flex gap-2">
          {/* add member to team - for moderators */}
          {(
            await checkPermission({
              permission: Permission.ADD_TEAM_MEMBER,
            })
          ).allowed && <AddTeamMemberButton />}

          {/* add member in any team - for admins */}
          {(
            await checkPermission({
              permission: Permission.ADD_WORKSPACE_MEMBER,
            })
          ).allowed && <AddWorkspaceMemberButton />}
        </div>
      </header>
    </div>
  );
}

export default MembersPage;
