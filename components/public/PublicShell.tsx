import type { ReactNode } from "react";
import "./public-pages.css";

/** Presentation only; route data, metadata and caching stay with their pages. */
export function PublicShell({ children }: { children: ReactNode }) {
  return <div className="public-design">{children}</div>;
}
