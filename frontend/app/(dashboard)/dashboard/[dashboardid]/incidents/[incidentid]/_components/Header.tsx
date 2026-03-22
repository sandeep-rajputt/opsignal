"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useGetIncidentQuery } from "@/Store/api/getIncidentApi/getIncidentApi";
import { useDeleteIncidentMutation } from "@/Store/api/deleteIncidentApi/deleteIncidentApi";
import { usePermission } from "@/hooks/usePermission";
import { useAppSelector } from "@/Store/hooks";
import { Permission } from "@/rbac/permissions";
import isApiError from "@/utils/isApiError";

function IncidentHeader({
  workspaceId,
  incidentId,
}: {
  workspaceId: string;
  incidentId: string;
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data, isLoading } = useGetIncidentQuery({ workspaceId, incidentId });
  const [deleteIncident, { isLoading: isDeleting }] =
    useDeleteIncidentMutation();

  const { allowed: canDeleteWork } = usePermission(Permission.DELETE_WORK);
  const currentUser = useAppSelector((state) => state.user.user);

  const isCreator = !!currentUser && data?.data?.createdById === currentUser.id;
  const showDelete = canDeleteWork || isCreator;

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-64" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-5 w-32 rounded-full" />
          </div>
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-16" />
        </div>
      </div>
    );
  }

  if (!data?.data) return null;

  const { title, severity, status, team } = data.data;

  return (
    <>
      <div className="grid grid-cols-[1fr_auto] items-center justify-between w-full">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-xl font-bold">{title}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="destructive">{severity}</Badge>
            <Badge variant="outline">{status}</Badge>
            {team && <Badge variant="secondary">{team.name}</Badge>}
          </div>
        </div>

        {showDelete && (
          <div className="flex items-center gap-2">
            <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
              Delete
            </Button>
          </div>
        )}
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete Incident</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this incident? This action cannot
              be undone.
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

export default IncidentHeader;
