import MarketingBackground from "@/components/shared/MarketingBackground";
import { ReactNode } from "react";

function MarketingLayout({ children }: { children: ReactNode }) {
  return <MarketingBackground>{children}</MarketingBackground>;
}

export default MarketingLayout;
