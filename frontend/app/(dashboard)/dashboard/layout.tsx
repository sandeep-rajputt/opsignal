import Background from "@/components/shared/Background";
import { ReactNode } from "react";

async function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Background>
      <div className="h-screen w-full flex items-center justify-center">
        {children}
      </div>
    </Background>
  );
}

export default DashboardLayout;
