"use client";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarGroup,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
  MenubarRadioGroup,
  MenubarRadioItem,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import isApiError from "@/utils/isApiError";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useDeleteImprovementMutation } from "@/Store/api/deleteImprovementApi/deleteImprovementApi";
import { useChangeImprovementStatusMutation } from "@/Store/api/changeImprovementStatusApi/changeImprovementStatusApi";
import { useChangeImprovementCategoryMutation } from "@/Store/api/changeImprovementCategoryApi/changeImprovementCategoryApi";
import { usePermission } from "@/hooks/usePermission";
import { useAppSelector, useAppDispatch } from "@/Store/hooks";
import { Permission } from "@/rbac/permissions";
import { EllipsisVerticalIcon } from "lucide-react";
import type { ImprovementStatus } from "@/schemas/common/improvementStatusSchema";
import type { ImprovementCategory } from "@/schemas/common/improvementCategorySchema";
import getImprovementApi from "@/Store/api/getImprovementApi/getImprovementApi";
import type { GetImprovementResponse } from "@/Store/api/getImprovementApi/schema/getImprovementResponseSchema";

function ImprovementActionButton({
  improvementId,
  improvementName,
  workspaceId,
  createdById,
  status,
  category,
}: {
  improvementName: string;
  improvementId: string;
  workspaceId: string;
  createdById: string;
  status: string;
  category: string;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [categoryConfirmOpen, setCategoryConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<ImprovementStatus | null>(
    null,
  );
  const [pendingCategory, setPendingCategory] =
    useState<ImprovementCategory | null>(null);

  const [deleteImprovement, { isLoading: isDeleting }] =
    useDeleteImprovementMutation();
  const [changeImprovementStatus, { isLoading: isChangingStatus }] =
    useChangeImprovementStatusMutation();
  const [changeImprovementCategory, { isLoading: isChangingCategory }] =
    useChangeImprovementCategoryMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { allowed: canDeleteWork } = usePermission(Permission.DELETE_WORK);
  const { allowed: canChangeWorkspaceStatus } = usePermission(
    Permission.CHANGE_WORKSPACE_WORK_STATUS,
  );
  const { allowed: canChangeTeamStatus } = usePermission(
    Permission.CHANGE_TEAM_WORK_STATUS,
  );
  const { allowed: canChangeWorkspaceCategory } = usePermission(
    Permission.CHANGE_WORKSPACE_WORK_CATEGORY,
  );
  const { allowed: canChangeTeamCategory } = usePermission(
    Permission.CHANGE_TEAM_WORK_CATEGORY,
  );
  const currentUser = useAppSelector((state) => state.user.user);

  const isCreator = !!currentUser && createdById === currentUser.id;
  const showDelete = canDeleteWork || isCreator;
  const showChangeStatus =
    canChangeWorkspaceStatus || canChangeTeamStatus || isCreator;
  const showChangeCategory =
    canChangeWorkspaceCategory || canChangeTeamCategory || isCreator;

  async function handleDelete() {
    try {
      await deleteImprovement({ workspaceId, improvementId }).unwrap();
      toast.success("Improvement deleted successfully");
      router.push(`/dashboard/${workspaceId}/improvements`);
    } catch (err) {
      const apiError = isApiError(err);
      toast.error(apiError?.message || "Failed to delete improvement");
    } finally {
      setConfirmOpen(false);
    }
  }

  function handleStatusSelect(value: string) {
    if (value === status) return;
    setPendingStatus(value as ImprovementStatus);
    setStatusConfirmOpen(true);
  }

  async function handleStatusChange() {
    if (!pendingStatus) return;
    const patchResult = dispatch(
      getImprovementApi.util.updateQueryData(
        "getImprovement",
        { workspaceId, improvementId },
        (draft: GetImprovementResponse) => {
          draft.data.status = pendingStatus;
        },
      ),
    );
    setStatusConfirmOpen(false);
    setPendingStatus(null);
    try {
      await changeImprovementStatus({
        workspaceId,
        improvementId,
        data: { status: pendingStatus },
        currentStatus: status as ImprovementStatus,
        userName: currentUser?.name ?? "Unknown",
        userId: currentUser?.id ?? "",
      }).unwrap();
      toast.success("Improvement status updated successfully");
    } catch (err) {
      patchResult.undo();
      const apiError = isApiError(err);
      toast.error(apiError?.message || "Failed to update improvement status");
    }
  }

  function handleCategorySelect(value: string) {
    if (value === category) return;
    setPendingCategory(value as ImprovementCategory);
    setCategoryConfirmOpen(true);
  }

  async function handleCategoryChange() {
    if (!pendingCategory) return;
    const patchResult = dispatch(
      getImprovementApi.util.updateQueryData(
        "getImprovement",
        { workspaceId, improvementId },
        (draft: GetImprovementResponse) => {
          draft.data.category = pendingCategory;
        },
      ),
    );
    setCategoryConfirmOpen(false);
    setPendingCategory(null);
    try {
      await changeImprovementCategory({
        workspaceId,
        improvementId,
        data: { category: pendingCategory },
        currentCategory: category as ImprovementCategory,
        userName: currentUser?.name ?? "Unknown",
        userId: currentUser?.id ?? "",
      }).unwrap();
      toast.success("Improvement category updated successfully");
    } catch (err) {
      patchResult.undo();
      const apiError = isApiError(err);
      toast.error(apiError?.message || "Failed to update improvement category");
    }
  }

  return (
    <>
      <Menubar className="px-0.5">
        <MenubarMenu>
          <MenubarTrigger className="px-0 m-0">
            <EllipsisVerticalIcon />
          </MenubarTrigger>
          <MenubarContent className="flex flex-col gap-1">
            <MenubarGroup>
              {showChangeStatus && (
                <MenubarSub>
                  <MenubarSubTrigger>Change Status</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarRadioGroup
                      value={status}
                      onValueChange={handleStatusSelect}
                    >
                      <MenubarRadioItem value="proposed">
                        Proposed
                      </MenubarRadioItem>
                      <MenubarRadioItem value="approved">
                        Approved
                      </MenubarRadioItem>
                      <MenubarRadioItem value="in_progress">
                        In Progress
                      </MenubarRadioItem>
                      <MenubarRadioItem value="done">Done</MenubarRadioItem>
                      <MenubarRadioItem value="rejected">
                        Rejected
                      </MenubarRadioItem>
                    </MenubarRadioGroup>
                  </MenubarSubContent>
                </MenubarSub>
              )}
              {showChangeCategory && (
                <MenubarSub>
                  <MenubarSubTrigger>Change Category</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarRadioGroup
                      value={category}
                      onValueChange={handleCategorySelect}
                    >
                      <MenubarRadioItem value="process">
                        Process
                      </MenubarRadioItem>
                      <MenubarRadioItem value="technical">
                        Technical
                      </MenubarRadioItem>
                      <MenubarRadioItem value="documentation">
                        Documentation
                      </MenubarRadioItem>
                      <MenubarRadioItem value="other">Other</MenubarRadioItem>
                    </MenubarRadioGroup>
                  </MenubarSubContent>
                </MenubarSub>
              )}
            </MenubarGroup>
            {showDelete && (
              <MenubarItem
                className="bg-destructive focus:bg-danger"
                onClick={() => setConfirmOpen(true)}
              >
                Delete
              </MenubarItem>
            )}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <Dialog open={statusConfirmOpen} onOpenChange={setStatusConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Change Improvement Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status of{" "}
              <span className="text-primary">{improvementName}</span> to{" "}
              <span className="text-primary">{pendingStatus}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            {!isChangingStatus && (
              <Button
                variant="outline"
                onClick={() => {
                  setStatusConfirmOpen(false);
                  setPendingStatus(null);
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleStatusChange}
              disabled={isChangingStatus}
              className="flex gap-2 items-center justify-center"
            >
              Confirm
              {isChangingStatus && <Spinner />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={categoryConfirmOpen} onOpenChange={setCategoryConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Change Improvement Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the category of{" "}
              <span className="text-primary">{improvementName}</span> to{" "}
              <span className="text-primary">{pendingCategory}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            {!isChangingCategory && (
              <Button
                variant="outline"
                onClick={() => {
                  setCategoryConfirmOpen(false);
                  setPendingCategory(null);
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleCategoryChange}
              disabled={isChangingCategory}
              className="flex gap-2 items-center justify-center"
            >
              Confirm
              {isChangingCategory && <Spinner />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete Improvement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="text-primary">{improvementName}</span>{" "}
              improvement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            {!isDeleting && (
              <Button variant="outline" onClick={() => setConfirmOpen(false)}>
                Cancel
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex gap-2 items-center justify-center"
            >
              Delete
              {isDeleting && <Spinner />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default ImprovementActionButton;
