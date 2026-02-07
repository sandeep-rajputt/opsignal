"use client";
import { ChevronsUpDown, CircleFadingPlus } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAppDispatch } from "@/Store/hooks";
import { showAddNewWorkspace } from "@/Store/slice/dialogsSlice";

export function WorkspaceSwitcher() {
  const router = useRouter();
  const params = useParams();
  const dashboardId = params.dashboardId;
  const dispatch = useAppDispatch();
  const { isLoading, data, isFetching } = useGetUserAllWorkspacesQuery(null);
  const { isMobile } = useSidebar();

  if (isFetching || isLoading) {
    return <Loader />;
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
            <DropdownMenuItem className="border-primary/50 border bg-primary/10 hover:bg-primary/15!">
              <div className="w-full">
                <div className="flex items-center justify-between w-full">
                  <p>Workspaces</p>
                  <p>{data.data.length}/5</p>
                </div>
                <div className="mt-4">
                  <Progress value={data.data.length * 20} />
                </div>
                <div className="mt-3">
                  <Button className="w-full">⚡ Add Workspace Slots</Button>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Current Workspace
            </DropdownMenuLabel>
            {data.data.map(
              (workspace, index) =>
                workspace.id === dashboardId && (
                  <DropdownMenuItem key={workspace.name} className="gap-2 p-2">
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
                  </DropdownMenuItem>
                ),
            )}

            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Joined Workspaces
            </DropdownMenuLabel>
            {data.data.map(
              (workspace, index) =>
                workspace.id !== dashboardId && (
                  <DropdownMenuItem key={workspace.name} className="gap-2 p-2">
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
                  </DropdownMenuItem>
                ),
            )}
            <DropdownMenuSeparator />
            {data.data.length > 4 ? (
              <>
                <Alert variant="destructive" className="max-w-md">
                  <AlertCircleIcon />
                  <AlertTitle>All slots filled</AlertTitle>
                  <AlertDescription>
                    Add more slots to create or join workspaces.
                  </AlertDescription>
                </Alert>
                <DropdownMenuItem className="gap-2 p-2 mt-2 border border-emerald-500/50 text-foreground">
                  <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                    <CircleFadingPlus className="size-4 text-foreground" />
                  </div>
                  <div className=" font-medium">Add a slot</div>
                </DropdownMenuItem>
              </>
            ) : (
              <DropdownMenuItem
                className="gap-2 p-2"
                onClick={() => dispatch(showAddNewWorkspace())}
              >
                <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                  <CircleFadingPlus className="size-4" />
                </div>
                <div className="text-muted-foreground font-medium">
                  Create New Workspace
                </div>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function Loader() {
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
