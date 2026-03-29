"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/Store/store";
import { useGetIncidentsQuery } from "@/Store/api/getIncidentsApi/getIncidentsApi";
import CreateTaskButton from "@/components/ui/CreateTaskButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { AlertTriangle } from "lucide-react";
import IncidentActionButton from "@/components/ui/IncidentActionButton";
import Link from "next/link";

function IncidentsPage() {
  const { dashboardid } = useParams<{ dashboardid: string }>();
  const workspaceId = useSelector(
    (state: RootState) => state.currentWorkspace.workspace?.id ?? dashboardid,
  );

  const { data, isLoading } = useGetIncidentsQuery({
    workspaceId: dashboardid,
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex gap-5 items-center w-full justify-between px-5 py-4">
          <div className="flex gap-2 items-center">
            <SidebarTrigger />
            <h1 className="font-semibold">Incidents</h1>
          </div>
          <div>
            <CreateTaskButton />
          </div>
        </div>
        <div className="px-5 pb-5 grid gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="flex flex-col gap-3 pt-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div>
        <div className="flex gap-5 items-center w-full justify-between px-5 py-4">
          <div className="flex gap-2 items-center">
            <SidebarTrigger />
            <h1 className="font-semibold">Incidents</h1>
          </div>
          <div>
            <CreateTaskButton />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <AlertTriangle />
              </EmptyMedia>
              <EmptyTitle>No incidents found</EmptyTitle>
              <EmptyDescription>
                Create your first incident to get started.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-5 items-center w-full justify-between px-5 py-4">
        <div className="flex gap-2 items-center">
          <SidebarTrigger />
          <h1 className="font-semibold">Incidents</h1>
        </div>
        <div>
          <CreateTaskButton />
        </div>
      </div>
      <div className="px-5 pb-5 grid gap-4">
        {data.data.map((incident) => (
          <Link
            key={incident.id}
            href={`/dashboard/${workspaceId}/incidents/${incident.id}`}
          >
            <Card className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base">
                      {incident.title}
                    </CardTitle>
                    {incident.description && (
                      <CardDescription className="mt-2 line-clamp-2">
                        {incident.description}
                      </CardDescription>
                    )}
                  </div>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0"
                  >
                    <IncidentActionButton
                      incidentId={incident.id}
                      incidentName={incident.title}
                      workspaceId={workspaceId}
                      createdById={incident.createdById}
                      status={incident.status}
                      severity={incident.severity}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 items-center -mt-3">
                <Badge
                  variant="outline"
                  className={
                    incident.severity === "critical"
                      ? "border-red-500 text-red-500"
                      : incident.severity === "high"
                        ? "border-orange-500 text-orange-500"
                        : incident.severity === "medium"
                          ? "border-yellow-500 text-yellow-500"
                          : "border-blue-500 text-blue-500"
                  }
                >
                  {incident.severity}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {incident.status}
                </Badge>
                <Badge variant="ghost">{incident.team?.name ?? "Global"}</Badge>
                <span className="text-xs text-muted-foreground ml-auto">
                  Created by {incident.createdBy}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default IncidentsPage;
