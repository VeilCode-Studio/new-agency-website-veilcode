"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";
  const dims =
    size === "sm" ? "size-8 [&_svg]:size-3.5" : "size-9 [&_svg]:size-4";

  return (
    <button
      type="button"
      aria-label={`Switch to ${isDark ? "light" : "dark"} theme`}
      title={`Switch to ${isDark ? "light" : "dark"} theme`}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-md border border-line bg-surface/60 text-ink-muted transition-colors hover:border-line-hi hover:text-ink",
        dims,
        className,
      )}
    >
      {/* Render a neutral placeholder pre-mount to avoid hydration mismatch */}
      {!mounted ? (
        <Sun className="opacity-0" />
      ) : isDark ? (
        <Sun />
      ) : (
        <Moon />
      )}
    </button>
  );
}
