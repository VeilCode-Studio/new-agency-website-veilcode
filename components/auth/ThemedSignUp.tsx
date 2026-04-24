"use client";

import { SignUp } from "@clerk/nextjs";
import { useClerkAppearance } from "./useClerkAppearance";

export function ThemedSignUp() {
  const appearance = useClerkAppearance();
  return (
    <SignUp
      appearance={appearance}
      signInUrl="/sign-in"
      fallbackRedirectUrl="/admin"
      forceRedirectUrl="/admin"
    />
  );
}
