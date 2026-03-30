"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AddWorkspaceMemberButton from "@/components/shared/addWorkspaceMemberButton";
import AddTeamMemberButton from "@/components/shared/addTeamMemberButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MemberCard } from "@/components/members/MemberCard";
import { useGetMembersQuery } from "@/Store/api/getMembersApi/getMembersApi";
import { useGetUserRoleQuery } from "@/Store/api/getUserRoleApi/getUserRoleApi";
import { useRemoveMemberMutation } from "@/Store/api/removeMemberApi/removeMemberApi";
import { useUpdateMemberRoleMutation } from "@/Store/api/updateMemberRoleApi/updateMemberRoleApi";
import canRemoveMember from "@/lib/canRemoveMember";
import { usePermission } from "@/hooks/usePermission";
import { Permission } from "@/rbac/permissions";
import { ROLE } from "@/rbac/roles";
import isApiError from "@/utils/isApiError";

function MembersPage() {
  const params = useParams();
  const dashboardId = params.dashboardid as string;
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Fetch members data
  const {
    data: membersData,
    isLoading: isLoadingMembers,
    error: membersError,
  } = useGetMembersQuery({
    workspaceId: dashboardId,
    page: currentPage,
    limit,
  });

  // Fetch current user's role
  const {
    data: userRoleData,
    isLoading: isLoadingRole,
    error: roleError,
  } = useGetUserRoleQuery(dashboardId);

  // Remove member mutation
  const [removeMember, { isLoading: isRemoving }] = useRemoveMemberMutation();

  // Update member role mutation
  const [updateMemberRole, { isLoading: isUpdatingRole }] =
    useUpdateMemberRoleMutation();

  // Check permissions for header buttons
  const { allowed: canAddTeamMember } = usePermission(
    Permission.ADD_TEAM_MEMBER,
  );
  const { allowed: canAddWorkspaceMember } = usePermission(
    Permission.ADD_WORKSPACE_MEMBER,
  );

  const handleRemoveMember = async (memberId: string) => {
    try {
      await removeMember({
        workspaceId: dashboardId,
        memberId,
      }).unwrap();

      toast.success("Member removed successfully");
    } catch (err) {
      const apiError = isApiError(err);
      if (apiError) {
        toast.error(apiError.message || "Failed to remove member");
      } else {
        toast.error("Failed to remove member");
      }
    }
  };

  const handleRoleUpdate = async (memberId: string, newRole: ROLE) => {
    try {
      await updateMemberRole({
        workspaceId: dashboardId,
        memberId,
        role: newRole,
      }).unwrap();

      toast.success("Member role updated successfully");
    } catch (err) {
      const apiError = isApiError(err);
      if (apiError) {
        toast.error(apiError.message || "Failed to update member role");
      } else {
        toast.error("Failed to update member role");
      }
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const currentUserRole = userRoleData?.message;
  const members = membersData?.data?.data || [];
  const total = membersData?.data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <header className="flex flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex gap-3 items-center lg:gap-5">
          <SidebarTrigger />
          <h1 className="text-xl font-semibold">Members</h1>
        </div>

        <div className="flex gap-2">
          {canAddTeamMember && <AddTeamMemberButton />}
          {canAddWorkspaceMember && <AddWorkspaceMemberButton />}
        </div>
      </header>

      <main className="px-4 py-4 lg:px-6">
        {/* Loading State */}
        {(isLoadingMembers || isLoadingRole) && (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 border rounded-lg"
              >
                <Skeleton className="size-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="size-8" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {(membersError || roleError) && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {(() => {
                const memberApiError = membersError
                  ? isApiError(membersError)
                  : null;
                const roleApiError = roleError ? isApiError(roleError) : null;

                if (memberApiError) {
                  return memberApiError.message || "Failed to load members";
                }
                if (roleApiError) {
                  return roleApiError.message || "Failed to load user role";
                }
                return "An error occurred while loading data";
              })()}
            </AlertDescription>
          </Alert>
        )}

        {/* Members List */}
        {!isLoadingMembers &&
          !isLoadingRole &&
          !membersError &&
          !roleError &&
          currentUserRole && (
            <>
              {members.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No members found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {members.map((member) => (
                    <MemberCard
                      key={member.id}
                      member={member}
                      currentUserRole={currentUserRole}
                      onRemove={handleRemoveMember}
                      onRoleUpdate={handleRoleUpdate}
                      canRemove={canRemoveMember(currentUserRole, member.role)}
                      isUpdatingRole={isUpdatingRole}
                    />
                  ))}
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1 || isRemoving || isUpdatingRole}
                  >
                    <ChevronLeft />
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>

                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={
                      currentPage === totalPages || isRemoving || isUpdatingRole
                    }
                  >
                    <ChevronRight />
                  </Button>
                </div>
              )}
            </>
          )}
      </main>
    </div>
  );
}

export default MembersPage;
