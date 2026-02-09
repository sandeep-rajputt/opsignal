import { ShieldAlert } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import { WorkspaceData } from "@/lib/getCurrentWorkspace";
import Image from "next/image";
import { SidebarTrigger } from "@/components/ui/sidebar";

async function UnknownWorkspace({ data }: { data: WorkspaceData }) {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr]">
      <header className="py-4 px-5">
        <SidebarTrigger />
      </header>
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <ShieldAlert className="h-12 w-12" />
          </EmptyMedia>
          <EmptyTitle>Access Denied</EmptyTitle>
          <EmptyDescription>
            You don&apos;t have permission to access this workspace.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="rounded-lg border bg-card p-4 text-left w-full">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                {data.logo_url && (
                  <Image
                    src={data.logo_url}
                    alt={data.name}
                    className="h-8 w-8 rounded"
                  />
                )}
                <div>
                  <p className="text-sm font-medium">{data.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Workspace ID: {data.id}
                  </p>
                </div>
              </div>
              {data.description && (
                <p className="text-xs text-muted-foreground">
                  {data.description}
                </p>
              )}
            </div>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}

export default UnknownWorkspace;
