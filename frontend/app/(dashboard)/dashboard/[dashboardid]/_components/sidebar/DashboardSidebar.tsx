"use client";
import { Sidebar } from "@/components/ui/sidebar";
export function DashboardSidebar({
  children,
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      {children}
    </Sidebar>
  );
}
