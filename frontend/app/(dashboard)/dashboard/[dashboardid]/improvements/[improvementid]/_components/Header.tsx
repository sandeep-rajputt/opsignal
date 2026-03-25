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
import { useGetImprovementQuery } from "@/Store/api/getImprovementApi/getImprovementApi";
import { useDeleteImprovementMutation } from "@/Store/api/deleteImprovementApi/deleteImprovementApi";
import { usePermission } from "@/hooks/usePermission";
import { useAppSelector } from "@/Store/hooks";
import { Permission } from "@/rbac/permissions";
import isApiError from "@/utils/isApiError";

function ImprovementHeader({
  workspaceId,
  improvementId,
}: {
  workspaceId: string;
  improvementId: string;
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data, isLoading } = useGetImprovementQuery({
    workspaceId,
    improvementId,
  });
  const [deleteImprovement, { isLoading: isDeleting }] =
    useDeleteImprovementMutation();

  const { allowed: canDeleteWork } = usePermission(Permission.DELETE_WORK);
  const currentUser = useAppSelector((state) => state.user.user);

  const isCreator = !!currentUser && data?.data?.createdById === currentUser.id;
  const showDelete = canDeleteWork || isCreator;

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

  if (!data?.data) return <h1>Improvement not Found</h1>;

  const { title, category, status, team } = data.data;

  return (
    <>
      <div className="grid grid-cols-[1fr_auto] items-center justify-between w-full">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-semibold">{title}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="destructive">{category}</Badge>
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
            <DialogTitle>Delete Improvement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this improvement? This action
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

export default ImprovementHeader;
