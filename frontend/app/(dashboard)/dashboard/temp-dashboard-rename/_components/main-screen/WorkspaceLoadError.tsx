"use client";

import { RefreshCw } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

function WorkspaceLoadError() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="h-screen grid grid-rows-[auto_1fr]">
      <header className="py-4 px-5">
        <SidebarTrigger />
      </header>
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <RefreshCw className="h-12 w-12" />
          </EmptyMedia>
          <EmptyTitle>Something Went Wrong</EmptyTitle>
          <EmptyDescription>
            Unable to load the workspace. Please try again later.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button onClick={handleRefresh} variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Page
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}

export default WorkspaceLoadError;
