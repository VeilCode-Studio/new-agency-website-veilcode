"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function MotionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  useEffect(() => {
    const regions = Array.from(document.querySelectorAll<HTMLElement>("[data-ambient]"));
    const visible = new Set<Element>();
    const allowed = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    const update = () => regions.forEach((region) => {
      region.dataset.active = String(allowed.matches && !document.hidden && visible.has(region));
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => entry.isIntersecting ? visible.add(entry.target) : visible.delete(entry.target));
      update();
    });
    regions.forEach((region) => observer.observe(region));
    document.addEventListener("visibilitychange", update);
    allowed.addEventListener("change", update);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
      allowed.removeEventListener("change", update);
      regions.forEach((region) => { delete region.dataset.active; });
    };
  }, [pathname]);

  return children;
}
