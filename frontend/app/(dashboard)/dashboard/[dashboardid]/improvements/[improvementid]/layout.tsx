import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";
import { getCurrentDashboardId } from "@/lib/getCurrentDashboardId";
import ImprovementHeader from "./_components/Header";
import { SidebarTrigger } from "@/components/ui/sidebar";

async function ImprovementLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ improvementid: string }>;
}) {
  const { improvementid } = await params;
  const workspaceId = await getCurrentDashboardId();

  if (!workspaceId) return null;

  return (
    <div>
      <div className="flex items-center px-5 py-4 gap-5 w-full">
        <SidebarTrigger />
        <ImprovementHeader
          workspaceId={workspaceId}
          improvementId={improvementid}
        />
      </div>
      <Separator />
      <div>{children}</div>
    </div>
  );
}

export default ImprovementLayout;
