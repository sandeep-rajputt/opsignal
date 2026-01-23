import { NuqsAdapter } from "nuqs/adapters/react";
import { ReactNode } from "react";

function NuqsProvider({ children }: { children: ReactNode }) {
  return <NuqsAdapter>{children}</NuqsAdapter>;
}

export default NuqsProvider;
