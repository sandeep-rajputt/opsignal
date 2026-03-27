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
import { useDeleteTaskMutation } from "@/Store/api/deleteTaskApi/deleteTaskApi";
import { useChangeTaskStatusMutation } from "@/Store/api/changeTaskStatusApi/changeTaskStatusApi";
import { useChangeTaskPriorityMutation } from "@/Store/api/changeTaskPriorityApi/changeTaskPriorityApi";
import { usePermission } from "@/hooks/usePermission";
import { useAppSelector, useAppDispatch } from "@/Store/hooks";
import { Permission } from "@/rbac/permissions";
import { EllipsisVerticalIcon } from "lucide-react";
import type { TaskStatus } from "@/schemas/common/taskStatusSchema";
import type { TaskPriority } from "@/schemas/common/taskPrioritySchema";
import getTaskApi from "@/Store/api/getTaskApi/getTaskApi";
import type { GetTaskResponse } from "@/Store/api/getTaskApi/schema/getTaskResponseSchema";

function TaskActionButton({
  taskId,
  taskName,
  workspaceId,
  createdById,
  status,
  priority,
}: {
  taskName: string;
  taskId: string;
  workspaceId: string;
  createdById: string;
  status: string;
  priority: string;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [priorityConfirmOpen, setPriorityConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TaskStatus | null>(null);
  const [pendingPriority, setPendingPriority] = useState<TaskPriority | null>(
    null,
  );

  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();
  const [changeTaskStatus, { isLoading: isChangingStatus }] =
    useChangeTaskStatusMutation();
  const [changeTaskPriority, { isLoading: isChangingPriority }] =
    useChangeTaskPriorityMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { allowed: canDeleteWork } = usePermission(Permission.DELETE_WORK);
  const { allowed: canChangeWorkspaceStatus } = usePermission(
    Permission.CHANGE_WORKSPACE_WORK_STATUS,
  );
  const { allowed: canChangeTeamStatus } = usePermission(
    Permission.CHANGE_TEAM_WORK_STATUS,
  );
  const { allowed: canChangeWorkspacePriority } = usePermission(
    Permission.CHANGE_WORKSPACE_WORK_PRIORITY,
  );
  const { allowed: canChangeTeamPriority } = usePermission(
    Permission.CHANGE_TEAM_WORK_PRIORITY,
  );
  const currentUser = useAppSelector((state) => state.user.user);

  const isCreator = !!currentUser && createdById === currentUser.id;
  const showDelete = canDeleteWork || isCreator;
  const showChangeStatus =
    canChangeWorkspaceStatus || canChangeTeamStatus || isCreator;
  const showChangePriority =
    canChangeWorkspacePriority || canChangeTeamPriority || isCreator;

  async function handleDelete() {
    try {
      await deleteTask({ workspaceId, taskId }).unwrap();
      toast.success("Task deleted successfully");
      router.push(`/dashboard/${workspaceId}/tasks`);
    } catch (err) {
      const apiError = isApiError(err);
      toast.error(apiError?.message || "Failed to delete task");
    } finally {
      setConfirmOpen(false);
    }
  }

  function handleStatusSelect(value: string) {
    if (value === status) return;
    setPendingStatus(value as TaskStatus);
    setStatusConfirmOpen(true);
  }

  async function handleStatusChange() {
    if (!pendingStatus) return;
    const patchResult = dispatch(
      getTaskApi.util.updateQueryData(
        "getTask",
        { workspaceId, taskId },
        (draft: GetTaskResponse) => {
          draft.data.status = pendingStatus;
        },
      ),
    );
    setStatusConfirmOpen(false);
    setPendingStatus(null);
    try {
      await changeTaskStatus({
        workspaceId,
        taskId,
        data: { status: pendingStatus },
      }).unwrap();
      toast.success("Task status updated successfully");
    } catch (err) {
      patchResult.undo();
      const apiError = isApiError(err);
      toast.error(apiError?.message || "Failed to update task status");
    }
  }

  function handlePrioritySelect(value: string) {
    if (value === priority) return;
    setPendingPriority(value as TaskPriority);
    setPriorityConfirmOpen(true);
  }

  async function handlePriorityChange() {
    if (!pendingPriority) return;
    const patchResult = dispatch(
      getTaskApi.util.updateQueryData(
        "getTask",
        { workspaceId, taskId },
        (draft: GetTaskResponse) => {
          draft.data.priority = pendingPriority;
        },
      ),
    );
    setPriorityConfirmOpen(false);
    setPendingPriority(null);
    try {
      await changeTaskPriority({
        workspaceId,
        taskId,
        data: { priority: pendingPriority },
      }).unwrap();
      toast.success("Task priority updated successfully");
    } catch (err) {
      patchResult.undo();
      const apiError = isApiError(err);
      toast.error(apiError?.message || "Failed to update task priority");
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
                      <MenubarRadioItem value="open">Open</MenubarRadioItem>
                      <MenubarRadioItem value="in_progress">
                        In Progress
                      </MenubarRadioItem>
                      <MenubarRadioItem value="blocked">
                        Blocked
                      </MenubarRadioItem>
                      <MenubarRadioItem value="done">Done</MenubarRadioItem>
                      <MenubarRadioItem value="cancelled">
                        Cancelled
                      </MenubarRadioItem>
                    </MenubarRadioGroup>
                  </MenubarSubContent>
                </MenubarSub>
              )}
              {showChangePriority && (
                <MenubarSub>
                  <MenubarSubTrigger>Change Priority</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarRadioGroup
                      value={priority}
                      onValueChange={handlePrioritySelect}
                    >
                      <MenubarRadioItem value="urgent">Urgent</MenubarRadioItem>
                      <MenubarRadioItem value="high">High</MenubarRadioItem>
                      <MenubarRadioItem value="medium">Medium</MenubarRadioItem>
                      <MenubarRadioItem value="low">Low</MenubarRadioItem>
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
            <DialogTitle>Change Task Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status of{" "}
              <span className="text-primary">{taskName}</span> to{" "}
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

      <Dialog open={priorityConfirmOpen} onOpenChange={setPriorityConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Change Task Priority</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the priority of{" "}
              <span className="text-primary">{taskName}</span> to{" "}
              <span className="text-primary">{pendingPriority}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            {!isChangingPriority && (
              <Button
                variant="outline"
                onClick={() => {
                  setPriorityConfirmOpen(false);
                  setPendingPriority(null);
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handlePriorityChange}
              disabled={isChangingPriority}
              className="flex gap-2 items-center justify-center"
            >
              Confirm
              {isChangingPriority && <Spinner />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="text-primary">{taskName}</span> task? This action
              cannot be undone.
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

export default TaskActionButton;
