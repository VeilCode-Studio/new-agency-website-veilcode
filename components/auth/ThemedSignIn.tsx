"use client";

import { SignIn } from "@clerk/nextjs";
import { useClerkAppearance } from "./useClerkAppearance";

export function ThemedSignIn() {
  const appearance = useClerkAppearance();
  return (
    <SignIn
      appearance={appearance}
      signUpUrl="/sign-up"
      fallbackRedirectUrl="/admin"
      forceRedirectUrl="/admin"
    />
  );
}
