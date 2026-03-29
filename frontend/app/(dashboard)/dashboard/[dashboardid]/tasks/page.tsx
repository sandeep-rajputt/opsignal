"use client";

import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/Store/store";
import { useGetTasksQuery } from "@/Store/api/getTasksApi/getTasksApi";
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
import { CheckSquare } from "lucide-react";
import TaskActionButton from "@/components/ui/TaskActionButton";
import Link from "next/link";

function TasksPage() {
  const { dashboardid } = useParams<{ dashboardid: string }>();
  const workspaceId = useSelector(
    (state: RootState) => state.currentWorkspace.workspace?.id ?? dashboardid,
  );

  const { data, isLoading } = useGetTasksQuery({
    workspaceId: dashboardid,
  });

  if (isLoading) {
    return (
      <div>
        <div className="flex gap-5 items-center w-full justify-between px-5 py-4">
          <div className="flex gap-2 items-center">
            <SidebarTrigger />
            <h1 className="font-semibold">Tasks</h1>
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
            <h1 className="font-semibold">Tasks</h1>
          </div>
          <div>
            <CreateTaskButton />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CheckSquare />
              </EmptyMedia>
              <EmptyTitle>No tasks found</EmptyTitle>
              <EmptyDescription>
                Create your first task to get started.
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
          <h1 className="font-semibold">Tasks</h1>
        </div>
        <div>
          <CreateTaskButton />
        </div>
      </div>
      <div className="px-5 pb-5 grid gap-4">
        {data.data.map((task) => (
          <Link
            key={task.id}
            href={`/dashboard/${workspaceId}/tasks/${task.id}`}
          >
            <Card className="cursor-pointer hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-base">{task.title}</CardTitle>
                    {task.description && (
                      <CardDescription className="mt-2 line-clamp-2">
                        {task.description}
                      </CardDescription>
                    )}
                  </div>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0"
                  >
                    <TaskActionButton
                      taskId={task.id}
                      taskName={task.title}
                      workspaceId={workspaceId}
                      createdById={task.createdById}
                      status={task.status}
                      priority={task.priority}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2 items-center -mt-3">
                <Badge
                  variant="outline"
                  className={
                    task.priority === "urgent"
                      ? "border-red-500 text-red-500"
                      : task.priority === "high"
                        ? "border-orange-500 text-orange-500"
                        : task.priority === "medium"
                          ? "border-yellow-500 text-yellow-500"
                          : "border-blue-500 text-blue-500"
                  }
                >
                  {task.priority}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {task.status.replace("_", " ")}
                </Badge>
                <Badge variant="ghost">{task.team?.name ?? "Global"}</Badge>
                {task.dueDate && (
                  <Badge variant="outline" className="text-xs">
                    Due: {new Date(task.dueDate).toLocaleDateString()}
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  Created by {task.createdBy}
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TasksPage;
