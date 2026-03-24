"use client";

import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/Store/store";
import { useGetIncidentQuery } from "@/Store/api/getIncidentApi/getIncidentApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

marked.use({ gfm: true, breaks: true });

function IncidentPage() {
  const { dashboardid, incidentid } = useParams<{
    dashboardid: string;
    incidentid: string;
  }>();
  const router = useRouter();
  const workspaceId = useSelector(
    (state: RootState) => state.currentWorkspace.workspace?.id ?? dashboardid,
  );

  const { data, isLoading } = useGetIncidentQuery({
    workspaceId: dashboardid,
    incidentId: incidentid,
  });

  if (isLoading) {
    return (
      <div className="flex gap-6 p-6 items-start">
        <Card className="flex-1">
          <CardContent className="flex flex-col gap-3 pt-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/6" />
            <Skeleton className="h-5 w-24 mt-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
        <Card className="w-64 shrink-0">
          <CardContent className="flex flex-col gap-4 pt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data?.data)
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <AlertTriangle />
            </EmptyMedia>
            <EmptyTitle>Incident not found</EmptyTitle>
            <EmptyDescription>
              This incident may have been deleted or does not exist.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={() => router.push(`/dashboard/${workspaceId}`)}>
              Go to dashboard
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );

  const { workspace, team, createdBy, severity, description } = data.data;

  // ✅ No useMemo — React Compiler handles this automatically
  const raw = marked(description ?? "") as string;
  const renderedDescription = DOMPurify.sanitize(raw);

  return (
    <div className="flex gap-6 p-6 items-start">
      <Card className="flex-1">
        <CardHeader>
          <CardDescription>DESCRIPTION</CardDescription>
        </CardHeader>

        {description ? (
          <CardContent
            className="prose prose-full"
            dangerouslySetInnerHTML={{ __html: renderedDescription }}
          />
        ) : (
          <CardContent>No description provided</CardContent>
        )}
      </Card>

      <Card className="w-64 shrink-0">
        <CardHeader>
          <CardTitle>Information</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 -mt-5">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Workspace</span>
            <span className="text-sm font-medium">{workspace.name}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Team</span>
            <span className="text-sm font-medium">
              {team?.name ?? "Global"}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Created by</span>
            <span className="text-sm font-medium">{createdBy}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">Severity</span>
            <span className="text-sm font-medium capitalize">{severity}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default IncidentPage;
