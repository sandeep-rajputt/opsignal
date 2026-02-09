import { AlertCircle } from "lucide-react";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import { SidebarTrigger } from "@/components/ui/sidebar";

async function WorkspaceNotExist() {
  return (
    <div className="h-screen grid grid-rows-[auto_1fr]">
      <header className="py-4 px-5">
        <SidebarTrigger />
      </header>
      <Empty>
        <EmptyHeader>
          <EmptyMedia>
            <AlertCircle className="h-12 w-12" />
          </EmptyMedia>
          <EmptyTitle>Workspace Does Not Exist</EmptyTitle>
          <EmptyDescription>
            This workspace could not be found. It may have been deleted or the
            URL is incorrect.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}

export default WorkspaceNotExist;
