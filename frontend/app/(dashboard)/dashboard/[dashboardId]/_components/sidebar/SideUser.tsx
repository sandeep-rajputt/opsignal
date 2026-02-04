"use client";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarGroup,
} from "@/components/ui/menubar";
import { useGetUserQuery } from "@/Store/api/getUserApi/getUserApi";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronUp, Lock, LogOut, MonitorSmartphone, User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function SideUser() {
  const router = useRouter();
  const { isLoading, data } = useGetUserQuery(null);

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Menubar noClass={true} className="w-full">
            <MenubarMenu>
              <MenubarTrigger asChild disabled={true} className="p-0 w-full">
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent py-7 data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <Skeleton className="h-8 w-8" />
                  </div>
                  <div className="grid gap-1 flex-1 text-left text-sm leading-tight">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </MenubarTrigger>
            </MenubarMenu>
          </Menubar>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!data?.data) {
    router.push("/");
    toast.error("Something went wrong");
    return;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Menubar noClass={true} className="w-full">
          <MenubarMenu>
            <MenubarTrigger asChild className="p-0 w-full">
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent py-7 data-[state=open]:text-sidebar-accent-foreground"
              >
                <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Avatar>
                    <AvatarImage src={data.data.avatarUrl || undefined} />
                    <AvatarFallback>UR</AvatarFallback>
                  </Avatar>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{data.data.name}</span>
                  <span className="truncate text-xs text-secondary">
                    {data.data.email}
                  </span>
                </div>
                <ChevronUp className="ml-auto" />
              </SidebarMenuButton>
            </MenubarTrigger>
            <MenubarContent align="end">
              <MenubarItem>
                <div className=" text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Avatar>
                    <AvatarImage src={data.data.avatarUrl || undefined} />
                    <AvatarFallback>UR</AvatarFallback>
                  </Avatar>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{data.data.name}</span>
                  <span className="truncate text-xs text-secondary">
                    {data.data.email}
                  </span>
                </div>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarGroup>
                <MenubarItem>
                  <User />
                  Profile
                </MenubarItem>
                <MenubarItem>
                  <Lock /> Security
                </MenubarItem>
                <MenubarItem>
                  <MonitorSmartphone />
                  Sessions
                </MenubarItem>
              </MenubarGroup>
              <MenubarSeparator />
              <MenubarItem variant="destructive">
                <LogOut />
                Logout
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default SideUser;
