import Background from "@/components/shared/Background";
import { ReactNode, Suspense } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { DashboardSidebar } from "./_components/sidebar/DashboardSidebar";
import Dialogs from "./_components/Dialogs/Dialogs";
import HydrateWorkspace from "./HydrateWorkspace";
import SidebarCustomContent from "./_components/sidebar/SidebarContent";
import DashboardContent from "./_components/main-screen/DashboardContent";
import SidebarContentLoader from "./_components/sidebar/SidebarContentLoader";
import HydrateNuqs from "./HydrateNuqs.client";
import { Spinner } from "@/components/ui/spinner";

async function DashboardLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ dashboardid: string }>;
}) {
  const { dashboardid } = await params;

  return (
    <>
      <HydrateWorkspace dashboardId={dashboardid} />
      <Dialogs />
      <SidebarProvider>
        <DashboardSidebar>
          <Suspense fallback={<SidebarContentLoader />}>
            <SidebarCustomContent />
          </Suspense>
        </DashboardSidebar>
        <SidebarInset className="bg-transparent">
          <Background>
            <Suspense
              fallback={
                <div className="w-full h-full flex items-center justify-center">
                  <Spinner />
                </div>
              }
            >
              <DashboardContent>
                <div className="h-screen w-full ">{children}</div>
              </DashboardContent>
            </Suspense>
          </Background>
        </SidebarInset>
      </SidebarProvider>
      <HydrateNuqs />
    </>
  );
}

export default DashboardLayout;
