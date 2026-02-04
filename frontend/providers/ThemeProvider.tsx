"use client";

import { createContext, useEffect, useState } from "react";

export type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "system",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === "undefined") return "system";
    return (localStorage.getItem("theme") as ThemeMode) || "system";
  });

  // Persist changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Apply light/dark classes
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "light") {
      root.classList.remove("dark");
      return;
    }

    if (theme === "dark") {
      root.classList.add("dark");
      return;
    }

    // System mode → no override (let OS control)
    root.classList.remove("dark");
  }, [theme]);

  // Live system mode updates
  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const update = () => {
      document.documentElement.classList.toggle("dark", media.matches);
    };

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
