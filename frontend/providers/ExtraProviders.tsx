import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

function ExtraProviders({ children }: { children: ReactNode }) {
  return (
    <>
      <TooltipProvider>
        {children}
        <Toaster />
      </TooltipProvider>
    </>
  );
}

export default ExtraProviders;
