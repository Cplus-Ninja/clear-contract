"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 rounded-lg border border-border/50 bg-muted/30 p-0.5">
        <span className="px-2 py-1 text-xs text-muted-foreground">Light</span>
        <span className="px-2 py-1 text-xs text-muted-foreground">Dark</span>
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <div
      role="group"
      aria-label="Toggle light or dark mode"
      className="flex items-center gap-0.5 rounded-lg border border-border/50 bg-muted/30 p-0.5"
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("light")}
        className={`
          h-7 gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors
          ${!isDark ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}
        `}
      >
        <Sun className="size-3.5" />
        Light
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setTheme("dark")}
        className={`
          h-7 gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors
          ${isDark ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}
        `}
      >
        <Moon className="size-3.5" />
        Dark
      </Button>
    </div>
  );
}
