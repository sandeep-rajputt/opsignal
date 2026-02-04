"use client";
import { ChevronsUpDown, CircleFadingPlus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { useGetUserAllWorkspacesQuery } from "@/Store/api/workspacesApi/workspacesApi";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export function WorkspaceSwitcher() {
  const router = useRouter();
  const params = useParams();
  const dashboardId = params.dashboardId;
  const { isLoading, data } = useGetUserAllWorkspacesQuery(null);
  const { isMobile } = useSidebar();

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger disabled={true} asChild>
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Skeleton className="w-8 h-8 rounded-full" />
                </div>
                <div className="grid flex-1 gap-1 text-left text-sm leading-tight">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!data?.data.length) {
    router.push("/login");
    return;
  }

  const selected = data.data.find((w) => w.id === dashboardId)!;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                <Avatar>
                  <AvatarImage src={selected.image} />
                  <AvatarFallback>WS</AvatarFallback>
                </Avatar>
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{selected.name}</span>
                <span className="truncate text-xs text-secondary">
                  {selected.role}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Workspaces
            </DropdownMenuLabel>
            {data.data.map((workspace, index) => (
              <DropdownMenuItem key={workspace.name} className="gap-2 p-2">
                {workspace.id === dashboardId ? (
                  <>
                    <div className="flex size-6 items-center justify-center rounded-md border">
                      <Avatar>
                        <AvatarImage src={workspace.image} />
                        <AvatarFallback>WS</AvatarFallback>
                      </Avatar>
                    </div>
                    {workspace.name}
                    <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                  </>
                ) : (
                  <>
                    <Link
                      href={`/dashboard/${workspace.id}`}
                      className="flex justify-between items-center w-full gap-2"
                    >
                      <div className="flex size-6 items-center justify-center rounded-md border">
                        <Avatar>
                          <AvatarImage src={workspace.image} />
                          <AvatarFallback>SR</AvatarFallback>
                        </Avatar>
                      </div>
                      {workspace.name}
                      <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
                    </Link>
                  </>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <CircleFadingPlus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">
                Create New Workspace
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
