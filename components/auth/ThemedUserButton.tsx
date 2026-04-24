"use client";

import { UserButton } from "@clerk/nextjs";
import { useClerkAppearance } from "./useClerkAppearance";

export function ThemedUserButton() {
  const appearance = useClerkAppearance();
  return <UserButton appearance={appearance} />;
}
