"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { BookOpen, Check, Moon, MoonStar, Palette, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_THEMES, type AppTheme } from "@/components/providers/ThemeProvider";

type Option = {
  value: AppTheme;
  label: string;
  hint: string;
  icon: typeof Sun;
};

const OPTIONS: Option[] = [
  { value: "light",    label: "Light",    hint: "Clean · bright",          icon: Sun },
  { value: "midnight", label: "Midnight", hint: "Deep navy · bespoke",     icon: MoonStar },
  { value: "linen",    label: "Linen",    hint: "Warm cream · editorial",  icon: BookOpen },
];

const ICON_BY_THEME: Record<AppTheme, typeof Sun> = {
  light: Sun,
  dark: Moon,
  midnight: MoonStar,
  linen: BookOpen,
};

export function ThemeToggle({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setMounted(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const currentValue = (theme === "system" ? resolvedTheme : theme) ?? "linen";
  const isAppTheme = (APP_THEMES as readonly string[]).includes(currentValue);
  const activeTheme: AppTheme = isAppTheme ? (currentValue as AppTheme) : "linen";
  const ActiveIcon = ICON_BY_THEME[activeTheme];

  const dims =
    size === "sm" ? "size-8 [&_svg]:size-3.5" : "size-9 [&_svg]:size-4";

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Choose theme"
        title="Choose theme"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-md border border-line bg-surface/60 text-ink-muted transition-colors hover:border-line-hi hover:text-ink",
          dims,
        )}
      >
        {!mounted ? <Sun className="opacity-0" /> : <ActiveIcon />}
      </button>

      {mounted && open && (
        <div
          role="menu"
          aria-label="Theme"
          className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-lg border border-line bg-surface shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)]"
        >
          <div className="flex items-center gap-2 border-b border-line px-3 py-2 text-[11px] uppercase tracking-widest text-ink-faint">
            <Palette className="size-3" />
            Theme
          </div>
          <ul role="none" className="py-1">
            {OPTIONS.map(({ value, label, hint, icon: Icon }) => {
              const active = activeTheme === value;
              return (
                <li key={value} role="none">
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => {
                      setTheme(value);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2 text-left transition-colors",
                      active ? "bg-surface-hi" : "hover:bg-surface-hi",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-7 shrink-0 place-items-center rounded-md border transition-colors",
                        active
                          ? "border-brand-border bg-brand-dim text-brand"
                          : "border-line bg-page text-ink-muted",
                      )}
                    >
                      <Icon className="size-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-ink">{label}</span>
                      <span className="block text-[11px] text-ink-muted">{hint}</span>
                    </span>
                    {active && <Check className="size-3.5 shrink-0 text-brand" />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
