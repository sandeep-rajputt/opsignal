"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/Store/store";
import { useGetImprovementsQuery } from "@/Store/api/getImprovementsApi/getImprovementsApi";
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
import { Lightbulb } from "lucide-react";
import ImprovementActionButton from "@/components/ui/ImprovementActionButton";
import Link from "next/link";

function ImprovementsPage() {
  const { dashboardid } = useParams<{ dashboardid: string }>();
  const workspaceId = useSelector(
    (state: RootState) => state.currentWorkspace.workspace?.id ?? dashboardid,
  );

  const { data, isLoading } = useGetImprovementsQuery({
    workspaceId: dashboardid,
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex gap-3 items-center w-full justify-between px-4 py-4 lg:gap-5 lg:px-6">
          <div className="flex gap-2 items-center">
            <SidebarTrigger />
            <h1 className="font-semibold">Improvements</h1>
          </div>
          <div>
            <CreateTaskButton />
          </div>
        </div>
        <div className="px-4 lg:px-6 pb-5 grid gap-4">
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
        <div className="flex gap-3 items-center w-full justify-between px-4 py-4 lg:gap-5 lg:px-6">
          <div className="flex gap-2 items-center">
            <SidebarTrigger />
            <h1 className="font-semibold">Improvements</h1>
          </div>
          <div>
            <CreateTaskButton />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Lightbulb />
              </EmptyMedia>
              <EmptyTitle>No improvements found</EmptyTitle>
              <EmptyDescription>
                Create your first improvement to get started.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex gap-3 items-center w-full justify-between px-4 py-4 lg:gap-5 lg:px-6">
        <div className="flex gap-2 items-center">
          <SidebarTrigger />
          <h1 className="font-semibold">Improvements</h1>
        </div>
        <div>
          <CreateTaskButton />
        </div>
      </div>
      <div className="px-4 lg:px-6 pb-5 grid gap-4">
        {data.data.map((improvement) => (
          <Link
            key={improvement.id}
            href={`/dashboard/${workspaceId}/improvements/${improvement.id}`}
          >
            <Card className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base">
                      {improvement.title}
                    </CardTitle>
                    {improvement.description && (
                      <CardDescription className="mt-2 line-clamp-2">
                        {improvement.description}
                      </CardDescription>
                    )}
                  </div>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0"
                  >
                    <ImprovementActionButton
                      improvementId={improvement.id}
                      improvementName={improvement.title}
                      workspaceId={workspaceId}
                      createdById={improvement.createdById}
                      status={improvement.status}
                      category={improvement.category}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 items-center -mt-3">
                <Badge variant="outline" className="capitalize">
                  {improvement.category}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {improvement.status.replace("_", " ")}
                </Badge>
                <Badge variant="ghost">
                  {improvement.team?.name ?? "Global"}
                </Badge>
                <span className="text-xs text-muted-foreground ml-auto">
                  Created by {improvement.createdBy}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ImprovementsPage;
