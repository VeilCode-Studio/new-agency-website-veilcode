import type { ReactNode } from "react";
import { AnimationBoundary } from "@/components/providers/AnimationBoundary";

export default function AnimatedRouteLayout({ children }: { children: ReactNode }) {
  return <AnimationBoundary>{children}</AnimationBoundary>;
}
