"use client";

import { useParams } from "next/navigation";
import { useGetUserRoleQuery } from "@/Store/api/getUserRoleApi/getUserRoleApi";
import { useGetBasicFeedQuery } from "@/Store/api/getBasicFeedApi/getBasicFeedApi";
import { useGetRecentActivityQuery } from "@/Store/api/getRecentActivityApi/getRecentActivityApi";
import { useGetOverviewQuery } from "@/Store/api/getOverviewApi/getOverviewApi";
import { useGetIncidentsBySeverityQuery } from "@/Store/api/getIncidentsBySeverityApi/getIncidentsBySeverityApi";
import { useGetTasksByStatusQuery } from "@/Store/api/getTasksByStatusApi/getTasksByStatusApi";
import CreateTaskButton from "@/components/ui/CreateTaskButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Activity,
  BarChart3,
  AlertTriangle,
  CheckSquare,
  Users,
  Lightbulb,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

function Dashboard() {
  const { dashboardid } = useParams<{ dashboardid: string }>();

  const { data: roleData, isLoading: roleLoading } =
    useGetUserRoleQuery(dashboardid);

  const userRole = roleData?.message;
  const viewType =
    userRole === "owner" || userRole === "admin" ? "workspace" : "team";

  const {
    data: basicFeedData,
    isLoading: basicFeedLoading,
    error: basicFeedError,
    refetch: refetchBasicFeed,
  } = useGetBasicFeedQuery(
    {
      workspaceId: dashboardid,
      feedType: viewType,
    },
    { skip: !userRole },
  );

  const {
    data: recentActivityData,
    isLoading: activityLoading,
    error: activityError,
    refetch: refetchActivity,
  } = useGetRecentActivityQuery(
    {
      workspaceId: dashboardid,
      activityType: viewType,
    },
    { skip: !userRole },
  );

  const {
    data: overviewData,
    isLoading: overviewLoading,
    error: overviewError,
    refetch: refetchOverview,
  } = useGetOverviewQuery(
    {
      workspaceId: dashboardid,
      overviewType: viewType,
    },
    { skip: !userRole },
  );

  const {
    data: incidentsData,
    isLoading: incidentsLoading,
    error: incidentsError,
    refetch: refetchIncidents,
  } = useGetIncidentsBySeverityQuery(
    {
      workspaceId: dashboardid,
      severityType: viewType,
    },
    { skip: !userRole },
  );

  const {
    data: tasksData,
    isLoading: tasksLoading,
    error: tasksError,
    refetch: refetchTasks,
  } = useGetTasksByStatusQuery(
    {
      workspaceId: dashboardid,
      statusType: viewType,
    },
    { skip: !userRole },
  );

  return (
    <div>
      <div className="flex gap-5 items-center w-full justify-between px-5 py-4">
        <div className="flex gap-2 items-center">
          <SidebarTrigger />
          <h1 className="font-semibold">Dashboard</h1>
        </div>
        <div>
          <CreateTaskButton />
        </div>
      </div>

      <div className="px-5 pb-3">
        <Alert>
          <AlertDescription>
            This project is still under active development. Some features like
            workspace upgrades, team management, and advanced analytics are
            currently being built.
          </AlertDescription>
        </Alert>
      </div>

      <div className="px-5 pb-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {roleLoading || basicFeedLoading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-4 rounded" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-16 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : basicFeedError ? (
          <div className="col-span-full">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>Failed to load dashboard stats. Please try again.</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchBasicFeed()}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          basicFeedData?.data && (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Members
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {basicFeedData.data.totalMembers}
                  </div>
                  {basicFeedData.data.memberLimit !== null && (
                    <p className="text-xs text-muted-foreground">
                      Limit: {basicFeedData.data.memberLimit}
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Unresolved Incidents
                  </CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {basicFeedData.data.incidents.total}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {basicFeedData.data.incidents.critical} critical
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Tasks
                  </CardTitle>
                  <CheckSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {basicFeedData.data.tasks.total}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {basicFeedData.data.tasks.urgent} urgent
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pending Improvements
                  </CardTitle>
                  <Lightbulb className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {basicFeedData.data.improvements.total}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Awaiting completion
                  </p>
                </CardContent>
              </Card>
            </>
          )
        )}
      </div>

      <div className="px-5 pb-5 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="p-3 rounded-lg border">
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                ))}
              </div>
            ) : activityError ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  Failed to load recent activity
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchActivity()}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </div>
            ) : recentActivityData?.data &&
              recentActivityData.data.length > 0 ? (
              <div className="space-y-3">
                {recentActivityData.data.map((activity) => (
                  <Link
                    key={activity.id}
                    href={`/dashboard/${dashboardid}/${activity.type === "incident" ? "incidents" : activity.type === "task" ? "tasks" : "improvements"}/${activity.id}`}
                    className="block p-3 rounded-lg border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="capitalize">
                            {activity.type}
                          </Badge>
                          {activity.teamName && (
                            <Badge variant="ghost">{activity.teamName}</Badge>
                          )}
                        </div>
                        <p className="font-medium truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          by {activity.createdBy}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="capitalize shrink-0"
                      >
                        {activity.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No recent activity
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {viewType === "workspace" ? "Workspace" : "Team"} Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            {overviewLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="space-y-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-8 w-12" />
                    </div>
                  ))}
                </div>
              </div>
            ) : overviewError ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  Failed to load overview
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchOverview()}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </div>
            ) : (
              overviewData?.data && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">
                      {overviewData.data.name}
                    </h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {overviewData.data.plan} plan
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {overviewData.data.totalTeams !== null && (
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Teams</p>
                        <p className="text-2xl font-bold">
                          {overviewData.data.totalTeams}
                        </p>
                      </div>
                    )}
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Members</p>
                      <p className="text-2xl font-bold">
                        {overviewData.data.totalMembers}
                        {overviewData.data.memberLimit !== null && (
                          <span className="text-sm text-muted-foreground font-normal">
                            {" "}
                            / {overviewData.data.memberLimit}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Incidents</p>
                      <p className="text-2xl font-bold">
                        {overviewData.data.totalIncidents}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Tasks</p>
                      <p className="text-2xl font-bold">
                        {overviewData.data.totalTasks}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Improvements
                      </p>
                      <p className="text-2xl font-bold">
                        {overviewData.data.totalImprovements}
                      </p>
                    </div>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Incidents by Severity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {incidentsLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                ))}
              </div>
            ) : incidentsError ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  Failed to load incidents data
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchIncidents()}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </div>
            ) : (
              incidentsData?.data && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20">
                    <span className="font-medium">Critical</span>
                    <span className="text-2xl font-bold">
                      {incidentsData.data.critical}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-orange-200 bg-orange-50 dark:bg-orange-950/20">
                    <span className="font-medium">High</span>
                    <span className="text-2xl font-bold">
                      {incidentsData.data.high}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
                    <span className="font-medium">Medium</span>
                    <span className="text-2xl font-bold">
                      {incidentsData.data.medium}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950/20">
                    <span className="font-medium">Low</span>
                    <span className="text-2xl font-bold">
                      {incidentsData.data.low}
                    </span>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Tasks by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-8 w-12" />
                  </div>
                ))}
              </div>
            ) : tasksError ? (
              <div className="text-center py-8">
                <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  Failed to load tasks data
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => refetchTasks()}
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Retry
                </Button>
              </div>
            ) : (
              tasksData?.data && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="font-medium">Open</span>
                    <span className="text-2xl font-bold">
                      {tasksData.data.open}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="font-medium">In Progress</span>
                    <span className="text-2xl font-bold">
                      {tasksData.data.inProgress}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950/20">
                    <span className="font-medium">Blocked</span>
                    <span className="text-2xl font-bold">
                      {tasksData.data.blocked}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20">
                    <span className="font-medium">Done</span>
                    <span className="text-2xl font-bold">
                      {tasksData.data.done}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg border">
                    <span className="font-medium">Cancelled</span>
                    <span className="text-2xl font-bold">
                      {tasksData.data.cancelled}
                    </span>
                  </div>
                </div>
              )
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Dashboard;
