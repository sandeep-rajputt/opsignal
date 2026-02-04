import { checkServerAuth } from "@/lib/validateServerAuth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { HydrateAuth } from "./HydrateAuth";

async function DashboardRouteLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = await checkServerAuth();

  if (!isAuthenticated) {
    redirect("/login");
  }

  return (
    <>
      <HydrateAuth user={user} auth={isAuthenticated} />
      {children}
    </>
  );
}

export default DashboardRouteLayout;
