import Background from "@/components/shared/Background";
import { ReactNode } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DashboardSidebar } from "./_components/sidebar/DashboardSidebar";
import Dialogs from "./_components/Dialogs/Dialogs";

async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Dialogs />
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset className="bg-transparent">
          <Background>
            <div className="h-screen w-full flex items-center justify-center">
              <SidebarTrigger />
              {children}
            </div>
          </Background>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

export default DashboardLayout;
