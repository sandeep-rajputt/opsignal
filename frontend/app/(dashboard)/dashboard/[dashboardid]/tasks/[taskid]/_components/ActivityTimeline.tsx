"use client";

import { useParams } from "next/navigation";
import { useGetTaskLogsQuery } from "@/Store/api/getTaskLogsApi/getTaskLogsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Clock,
  FileEdit,
  GitBranch,
  AlertTriangle,
  TrendingUp,
  Flame,
} from "lucide-react";
import type { WorkLog } from "@/schemas/workLogsSchema";

function ActivityTimeLine() {
  const { dashboardid, taskid } = useParams<{
    dashboardid: string;
    taskid: string;
  }>();

  const { data, isLoading } = useGetTaskLogsQuery({
    workspaceId: dashboardid,
    taskId: taskid,
  });

  const getIcon = (logType: WorkLog["name"]) => {
    switch (logType) {
      case "status_change":
        return <GitBranch className="w-4 h-4" />;
      case "severity_change":
        return <Flame className="w-4 h-4" />;
      case "priority_change":
        return <TrendingUp className="w-4 h-4" />;
      case "category_change":
        return <AlertTriangle className="w-4 h-4" />;
      case "content_update":
        return <FileEdit className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getIconColor = (logType: WorkLog["name"]) => {
    switch (logType) {
      case "status_change":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "severity_change":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "priority_change":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "category_change":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "content_update":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const renderLogContent = (log: WorkLog) => {
    if (log.name === "content_update") {
      return (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-muted-foreground">Content updated by</span>
          <span className="font-medium">{log.data.by.name}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">
            {formatTime(log.data.at)}
          </span>
        </div>
      );
    }

    const changeTypeMap = {
      status_change: "Status changed from",
      severity_change: "Severity changed from",
      priority_change: "Priority changed from",
      category_change: "Category changed from",
    };

    const getValueColor = (value: string, logType: WorkLog["name"]) => {
      if (logType === "priority_change") {
        if (value === "urgent") return "text-red-500";
        if (value === "high") return "text-orange-500";
        if (value === "medium") return "text-yellow-500";
        if (value === "low") return "text-green-500";
      }
      if (logType === "status_change") {
        if (value === "in_progress") return "text-blue-500";
        if (value === "done") return "text-green-500";
        if (value === "blocked") return "text-red-500";
        if (value === "cancelled") return "text-gray-500";
      }
      if (logType === "category_change") {
        return "text-blue-500";
      }
      return "text-foreground";
    };

    if (
      log.name === "status_change" ||
      log.name === "severity_change" ||
      log.name === "priority_change" ||
      log.name === "category_change"
    ) {
      return (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-muted-foreground">
            {changeTypeMap[log.name]}
          </span>
          <span
            className={`font-medium capitalize ${getValueColor(log.data.from, log.name)}`}
          >
            {log.data.from.replace("_", " ")}
          </span>
          <span className="text-muted-foreground">→</span>
          <span
            className={`font-medium capitalize ${getValueColor(log.data.to, log.name)}`}
          >
            {log.data.to.replace("_", " ")}
          </span>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground text-sm">by</span>
          <span className="font-medium">{log.data.by.name}</span>
          <span className="text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">
            {formatTime(log.data.at)}
          </span>
        </div>
      );
    }

    return null;
  };

  if (isLoading) {
    return (
      <div className="px-6 pb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <CardTitle>Activity Timeline</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-10 h-10 rounded-full shrink-0" />
                <Skeleton className="h-10 flex-1" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="px-6 pb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <CardTitle>Activity Timeline</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">
              No activity logs yet
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="px-6 pb-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <CardTitle>Activity Timeline</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {data.data.map((log, index) => (
              <div key={index} className="flex gap-4 pb-6 last:pb-0">
                <div className="relative flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center shrink-0 ${getIconColor(log.name)}`}
                  >
                    {getIcon(log.name)}
                  </div>
                  {index !== data.data.length - 1 && (
                    <div className="w-0.5 h-full bg-border absolute top-10" />
                  )}
                </div>
                <div className="flex-1 pt-2">
                  <div className="bg-card border rounded-lg p-4">
                    {renderLogContent(log)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ActivityTimeLine;
