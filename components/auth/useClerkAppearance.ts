"use client";

import { useTheme } from "next-themes";
import { useMemo } from "react";
import { APP_THEMES, type AppTheme } from "@/components/providers/ThemeProvider";
import { getClerkAppearance } from "./clerkAppearance";

function isAppTheme(theme: string | undefined): theme is AppTheme {
  return !!theme && (APP_THEMES as readonly string[]).includes(theme);
}

export function useClerkAppearance() {
  const { resolvedTheme } = useTheme();
  const theme: AppTheme = isAppTheme(resolvedTheme) ? resolvedTheme : "dark";
  return useMemo(() => getClerkAppearance(theme), [theme]);
}
