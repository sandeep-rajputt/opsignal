import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";
import { getCurrentDashboardId } from "@/lib/getCurrentDashboardId";
import TaskHeader from "./_components/Header";
import { SidebarTrigger } from "@/components/ui/sidebar";

async function TaskLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ taskid: string }>;
}) {
  const { taskid } = await params;
  const workspaceId = await getCurrentDashboardId();

  if (!workspaceId) return null;

  return (
    <div>
      <div className="flex items-center px-6 py-4 gap-5 w-full">
        <SidebarTrigger />
        <TaskHeader workspaceId={workspaceId} taskId={taskid} />
      </div>
      <Separator />
      <div>{children}</div>
    </div>
  );
}

export default TaskLayout;
