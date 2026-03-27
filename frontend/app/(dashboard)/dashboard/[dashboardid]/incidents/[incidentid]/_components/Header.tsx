"use client";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetIncidentQuery } from "@/Store/api/getIncidentApi/getIncidentApi";
import IncidentActionButton from "@/components/ui/IncidentActionButton";

function IncidentHeader({
  workspaceId,
  incidentId,
}: {
  workspaceId: string;
  incidentId: string;
}) {
  console.log("render header");
  const { data, isLoading } = useGetIncidentQuery({ workspaceId, incidentId });

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

  if (!data?.data) return <h1>Incident not Found</h1>;

  const { title, severity, status, team } = data.data;

  return (
    <>
      <div className="grid grid-cols-[1fr_auto] items-center justify-between w-full">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-semibold">{title}</h1>
          <div className="flex items-center gap-2">
            <Badge variant="destructive">{severity}</Badge>
            <Badge variant="outline">{status}</Badge>
            {team && <Badge variant="secondary">{team.name}</Badge>}
          </div>
        </div>

        <IncidentActionButton
          workspaceId={workspaceId}
          createdById={data.data.createdById}
          incidentName={title}
          incidentId={data.data.id}
          status={status}
          severity={severity}
        />
      </div>
    </>
  );
}

export default IncidentHeader;
