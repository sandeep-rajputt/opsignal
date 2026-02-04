"use client";

import { useContext, useState } from "react";
import { ThemeContext, ThemeMode } from "@/providers/ThemeProvider";

import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SunMedium,
  Moon,
  MonitorCog,
  ChevronsUpDown,
  Check,
} from "lucide-react";

const themes = ["Light", "Dark", "System"];

function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [selected, setSelectedTheme] = useState(
    theme === "light" ? themes[0] : theme === "dark" ? themes[1] : themes[2],
  );

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
                {selected === "Light" && (
                  <SunMedium className="text-secondary" />
                )}
                {selected === "Dark" && <Moon className="text-secondary" />}
                {selected === "System" && (
                  <MonitorCog className="text-secondary" />
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate text-xs text-secondary">Theme</span>
                <span className="truncate font-medium">{selected}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side="top"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Theme
            </DropdownMenuLabel>
            {themes.map((t) => {
              return (
                <DropdownMenuItem
                  key={t}
                  className="gap-2 p-2"
                  onClick={() => {
                    setSelectedTheme(t);
                    setTheme(t.toLowerCase() as ThemeMode);
                  }}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    {t === "Light" && <SunMedium />}
                    {t === "Dark" && <Moon />}
                    {t === "System" && <MonitorCog />}
                  </div>
                  {t}
                  {t === selected && (
                    <div className="ml-auto">
                      <Check />
                    </div>
                  )}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default ThemeSwitcher;
