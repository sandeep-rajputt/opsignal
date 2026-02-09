import { getCurrentWorkspace } from "@/lib/getCurrentWorkspace";
import { ReactNode } from "react";
import WorkspaceLoadError from "./WorkspaceLoadError";
import WorkspaceNotExist from "./WorkspaceNotExist";
import UnknownWorkspace from "./UnknownWorkspace";

async function DashboardContent({ children }: { children: ReactNode }) {
  const { success, workspace, status } = await getCurrentWorkspace();

  if (status === 404) {
    return <WorkspaceNotExist />;
  }
  if (!success && !workspace) {
    return <WorkspaceLoadError />;
  }

  if (success && workspace && workspace.role === null) {
    return <UnknownWorkspace data={workspace} />;
  }

  return children;
}

export default DashboardContent;
