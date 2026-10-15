"use client";

import { LazyMotion, MotionConfig, type FeatureBundle } from "framer-motion";
import { useCallback, useState, type ReactNode } from "react";

// Only animated route layouts import this module. Home never loads its runtime.
export function AnimationBoundary({ children }: { children: ReactNode }) {
  const [failed, setFailed] = useState(false);
  const loadFeatures = useCallback(async () => {
    try {
      return (await import("@/lib/motion-features")).default;
    } catch {
      setFailed(true);
      return {} as FeatureBundle;
    }
  }, []);

  return (
    <div className="contents" data-motion-failed={failed || undefined}>
      <LazyMotion features={loadFeatures} strict>
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
      </LazyMotion>
    </div>
  );
}
