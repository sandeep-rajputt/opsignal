import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { getCurrentDashboardId } from "@/lib/getCurrentDashboardId";

export default async function NotFound() {
  const workspaceId = await getCurrentDashboardId();

  return (
    <div className="flex flex-col h-screen w-full">
      {/* Header — matches page.tsx pattern */}
      <div className="flex gap-2 items-center px-5 py-4 border-b border-border">
        <SidebarTrigger />
        <h1 className="font-semibold">Not Found</h1>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center px-4">
        <span className="text-7xl font-bold text-foreground select-none">
          404
        </span>
        <h2 className="text-xl font-semibold text-foreground">
          Page not found
        </h2>
        <p className="text-sm text-muted-foreground max-w-xs">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Button asChild size="sm" className="mt-2">
          {workspaceId ? (
            <Link href={`/dashboard/${workspaceId}`}>Go to dashboard</Link>
          ) : (
            <Link href="/">Go home</Link>
          )}
        </Button>
      </div>
    </div>
  );
}
