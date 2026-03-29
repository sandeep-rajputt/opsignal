"use client";

import { useParams } from "next/navigation";
import { useGetUserRoleQuery } from "@/Store/api/getUserRoleApi/getUserRoleApi";
import { useGetBasicFeedQuery } from "@/Store/api/getBasicFeedApi/getBasicFeedApi";
import CreateTaskButton from "@/components/ui/CreateTaskButton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, AlertTriangle, CheckSquare, Lightbulb } from "lucide-react";

function Dashboard() {
  const { dashboardid } = useParams<{ dashboardid: string }>();

  const { data: roleData, isLoading: roleLoading } =
    useGetUserRoleQuery(dashboardid);

  const userRole = roleData?.message;
  const feedType =
    userRole === "owner" || userRole === "admin" ? "workspace" : "team";

  const {
    data: feedData,
    isLoading: feedLoading,
    error,
  } = useGetBasicFeedQuery(
    {
      workspaceId: dashboardid,
      feedType,
    },
    { skip: !userRole },
  );

  const isLoading = roleLoading || feedLoading;

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

      {error && (
        <div className="px-5 pb-5">
          <Alert variant="destructive">
            <AlertDescription>
              Failed to load dashboard data. Please try again.
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="px-5 pb-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
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
        ) : (
          feedData?.data && (
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
                    {feedData.data.totalMembers}
                  </div>
                  {feedData.data.memberLimit !== null && (
                    <p className="text-xs text-muted-foreground">
                      Limit: {feedData.data.memberLimit}
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
                    {feedData.data.incidents.total}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {feedData.data.incidents.critical} critical
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
                    {feedData.data.tasks.total}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {feedData.data.tasks.urgent} urgent
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
                    {feedData.data.improvements.total}
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
    </div>
  );
}

export default Dashboard;
