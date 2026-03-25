import { Separator } from "@/components/ui/separator";
import { ReactNode } from "react";
import { getCurrentDashboardId } from "@/lib/getCurrentDashboardId";
import IncidentHeader from "./_components/Header";
import { SidebarTrigger } from "@/components/ui/sidebar";

async function IncidentLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ incidentid: string }>;
}) {
  const { incidentid } = await params;
  const workspaceId = await getCurrentDashboardId();

  if (!workspaceId) return null;

  return (
    <div>
      <div className="flex items-center px-5 py-4 gap-5 w-full">
        <SidebarTrigger />
        <IncidentHeader workspaceId={workspaceId} incidentId={incidentid} />
      </div>
      <Separator />
      <div>{children}</div>
    </div>
  );
}

export default IncidentLayout;
