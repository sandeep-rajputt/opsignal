"use client";

import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import type { RootState } from "@/Store/store";
import { useGetImprovementQuery } from "@/Store/api/getImprovementApi/getImprovementApi";
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

function ImprovementPage() {
  const { dashboardid, improvementid } = useParams<{
    dashboardid: string;
    improvementid: string;
  }>();
  const router = useRouter();
  const workspaceId = useSelector(
    (state: RootState) => state.currentWorkspace.workspace?.id ?? dashboardid,
  );

  const { data, isLoading } = useGetImprovementQuery({
    workspaceId: dashboardid,
    improvementId: improvementid,
  });

  if (isLoading) {
    return (
      <div className="flex gap-6 p-6 items-start">
        <div className="flex flex-col gap-6 flex-1">
          <Card>
            <CardContent className="flex flex-col gap-3 pt-2">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/6" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-3 pt-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
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
            <EmptyTitle>Improvement not found</EmptyTitle>
            <EmptyDescription>
              This improvement may have been deleted or does not exist.
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

  const { workspace, team, createdBy, category, description, expectedImpact } =
    data.data;

  // ✅ No useMemo — React Compiler handles this automatically
  const rawDescription = marked(description ?? "") as string;
  const renderedDescription = DOMPurify.sanitize(rawDescription);

  const rawExpectedImpact = marked(expectedImpact ?? "") as string;
  const renderedExpectedImpact = DOMPurify.sanitize(rawExpectedImpact);

  return (
    <div className="flex gap-6 p-6 items-start">
      <div className="flex flex-col gap-6 flex-1">
        <Card>
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

        <Card>
          <CardHeader>
            <CardDescription>EXPECTED IMPACT</CardDescription>
          </CardHeader>

          {expectedImpact ? (
            <CardContent
              className="prose prose-full"
              dangerouslySetInnerHTML={{ __html: renderedExpectedImpact }}
            />
          ) : (
            <CardContent>No expected impact provided</CardContent>
          )}
        </Card>
      </div>

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
            <span className="text-xs text-muted-foreground">Category</span>
            <span className="text-sm font-medium capitalize">{category}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ImprovementPage;
