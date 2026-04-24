"use client";

import { useTheme } from "next-themes";
import { useMemo } from "react";
import { getClerkAppearance } from "./clerkAppearance";

export function useClerkAppearance() {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "light" ? "light" : "dark";
  return useMemo(() => getClerkAppearance(theme), [theme]);
}
