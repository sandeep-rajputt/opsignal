import { Toaster } from "@/components/ui/sonner";
import { ReactNode } from "react";

function ExtraProviders({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}

export default ExtraProviders;
