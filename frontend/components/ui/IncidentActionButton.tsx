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
import { useDeleteIncidentMutation } from "@/Store/api/deleteIncidentApi/deleteIncidentApi";
import { useChangeIncidentStatusMutation } from "@/Store/api/changeIncidentStatusApi/changeIncidentStatusApi";
import { useChangeIncidentSeverityMutation } from "@/Store/api/changeIncidentSeverityApi/changeIncidentSeverityApi";
import { usePermission } from "@/hooks/usePermission";
import { useAppSelector, useAppDispatch } from "@/Store/hooks";
import { Permission } from "@/rbac/permissions";
import { EllipsisVerticalIcon } from "lucide-react";
import type { IncidentStatus } from "@/schemas/common/incidentStatusSchema";
import type { IncidentSeverity } from "@/schemas/common/incidentSeveritySchema";
import getIncidentApi from "@/Store/api/getIncidentApi/getIncidentApi";
import type { GetIncidentResponse } from "@/Store/api/getIncidentApi/schema/getIncidentResponseSchema";

function IncidentActionButton({
  incidentId,
  incidentName,
  workspaceId,
  createdById,
  status,
  severity,
}: {
  incidentName: string;
  incidentId: string;
  workspaceId: string;
  createdById: string;
  status: string;
  severity: string;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [statusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [severityConfirmOpen, setSeverityConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<IncidentStatus | null>(
    null,
  );
  const [pendingSeverity, setPendingSeverity] =
    useState<IncidentSeverity | null>(null);

  const [deleteIncident, { isLoading: isDeleting }] =
    useDeleteIncidentMutation();
  const [changeIncidentStatus, { isLoading: isChangingStatus }] =
    useChangeIncidentStatusMutation();
  const [changeIncidentSeverity, { isLoading: isChangingSeverity }] =
    useChangeIncidentSeverityMutation();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { allowed: canDeleteWork } = usePermission(Permission.DELETE_WORK);
  const { allowed: canChangeWorkspaceStatus } = usePermission(
    Permission.CHANGE_WORKSPACE_WORK_STATUS,
  );
  const { allowed: canChangeTeamStatus } = usePermission(
    Permission.CHANGE_TEAM_WORK_STATUS,
  );
  const { allowed: canChangeWorkspaceSeverity } = usePermission(
    Permission.CHANGE_WORKSPACE_WORK_SEVERITY,
  );
  const { allowed: canChangeTeamSeverity } = usePermission(
    Permission.CHANGE_TEAM_WORK_SEVERITY,
  );
  const currentUser = useAppSelector((state) => state.user.user);

  const isCreator = !!currentUser && createdById === currentUser.id;
  const showDelete = canDeleteWork || isCreator;
  const showChangeStatus =
    canChangeWorkspaceStatus || canChangeTeamStatus || isCreator;
  const showChangeSeverity =
    canChangeWorkspaceSeverity || canChangeTeamSeverity || isCreator;

  async function handleDelete() {
    try {
      await deleteIncident({ workspaceId, incidentId }).unwrap();
      toast.success("Incident deleted successfully");
      router.push(`/dashboard/${workspaceId}/incidents`);
    } catch (err) {
      const apiError = isApiError(err);
      toast.error(apiError?.message || "Failed to delete incident");
    } finally {
      setConfirmOpen(false);
    }
  }

  function handleStatusSelect(value: string) {
    if (value === status) return;
    setPendingStatus(value as IncidentStatus);
    setStatusConfirmOpen(true);
  }

  async function handleStatusChange() {
    if (!pendingStatus) return;
    const patchResult = dispatch(
      getIncidentApi.util.updateQueryData(
        "getIncident",
        { workspaceId, incidentId },
        (draft: GetIncidentResponse) => {
          draft.data.status = pendingStatus;
        },
      ),
    );
    setStatusConfirmOpen(false);
    setPendingStatus(null);
    try {
      await changeIncidentStatus({
        workspaceId,
        incidentId,
        data: { status: pendingStatus },
      }).unwrap();
      toast.success("Incident status updated successfully");
    } catch (err) {
      patchResult.undo();
      const apiError = isApiError(err);
      toast.error(apiError?.message || "Failed to update incident status");
    }
  }

  function handleSeveritySelect(value: string) {
    if (value === severity) return;
    setPendingSeverity(value as IncidentSeverity);
    setSeverityConfirmOpen(true);
  }

  async function handleSeverityChange() {
    if (!pendingSeverity) return;
    const patchResult = dispatch(
      getIncidentApi.util.updateQueryData(
        "getIncident",
        { workspaceId, incidentId },
        (draft: GetIncidentResponse) => {
          draft.data.severity = pendingSeverity;
        },
      ),
    );
    setSeverityConfirmOpen(false);
    setPendingSeverity(null);
    try {
      await changeIncidentSeverity({
        workspaceId,
        incidentId,
        data: { severity: pendingSeverity },
      }).unwrap();
      toast.success("Incident severity updated successfully");
    } catch (err) {
      patchResult.undo();
      const apiError = isApiError(err);
      toast.error(apiError?.message || "Failed to update incident severity");
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
                  <MenubarSubTrigger>Chnage Status</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarRadioGroup
                      value={status}
                      onValueChange={handleStatusSelect}
                    >
                      <MenubarRadioItem value="open">Open</MenubarRadioItem>
                      <MenubarRadioItem value="investigating">
                        Investigating
                      </MenubarRadioItem>
                      <MenubarRadioItem value="identified">
                        Identified
                      </MenubarRadioItem>
                      <MenubarRadioItem value="monitoring">
                        Monitoring
                      </MenubarRadioItem>
                      <MenubarRadioItem value="resolved">
                        Resolved
                      </MenubarRadioItem>
                    </MenubarRadioGroup>
                  </MenubarSubContent>
                </MenubarSub>
              )}
              {showChangeSeverity && (
                <MenubarSub>
                  <MenubarSubTrigger>Change Severity</MenubarSubTrigger>
                  <MenubarSubContent>
                    <MenubarRadioGroup
                      value={severity}
                      onValueChange={handleSeveritySelect}
                    >
                      <MenubarRadioItem value="critical">
                        Critical
                      </MenubarRadioItem>
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
            <DialogTitle>Change Incident Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the status of{" "}
              <span className="text-primary">{incidentName}</span> to{" "}
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

      <Dialog open={severityConfirmOpen} onOpenChange={setSeverityConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Change Incident Severity</DialogTitle>
            <DialogDescription>
              Are you sure you want to change the severity of{" "}
              <span className="text-primary">{incidentName}</span> to{" "}
              <span className="text-primary">{pendingSeverity}</span>?
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2 justify-end">
            {!isChangingSeverity && (
              <Button
                variant="outline"
                onClick={() => {
                  setSeverityConfirmOpen(false);
                  setPendingSeverity(null);
                }}
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleSeverityChange}
              disabled={isChangingSeverity}
              className="flex gap-2 items-center justify-center"
            >
              Confirm
              {isChangingSeverity && <Spinner />}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete Incident</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="text-primary">{incidentName}</span> incident?
              This action cannot be undone.
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

export default IncidentActionButton;
