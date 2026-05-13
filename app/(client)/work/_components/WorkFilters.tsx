"use client";

import { motion } from "framer-motion";
import {
  type FilterKey,
  type FilterTab,
  FILTER_TABS,
} from "@/constants/projects";
import { Button } from "@/components/ui/button";
import type { Project } from "@/db/schema";

interface Props {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
  projects: Project[];
}

export function WorkFilters({ active, onChange, projects }: Props) {
  function count(key: FilterKey): number {
    if (key === "all") return projects.length;
    return projects.filter((project) => project.service === key).length;
  }

  return (
    <div
      className="sticky top-18 z-30 bg-page/90 backdrop-blur-lg
      border-b border-line py-4 px-6 md:px-10"
    >
      <div className="max-w-300 mx-auto">
        <div
          aria-label="Filter projects by service"
          className="flex items-center gap-2 flex-wrap"
        >
          {FILTER_TABS.map((tab: FilterTab) => {
            const isActive = active === tab.key;
            const n = count(tab.key);

            return (
              <Button
                key={tab.key}
                role="tab"
                aria-selected={isActive}
                onClick={() => onChange(tab.key)}
                className={`relative inline-flex items-center gap-2
                  font-sans text-[13px] font-medium px-4 py-2 rounded-lg border
                  cursor-pointer outline-none transition-all duration-200
                  focus-visible:ring-2 focus-visible:ring-brand
                  focus-visible:ring-offset-2 focus-visible:ring-offset-page
                  ${
                    isActive
                      ? tab.classes.active
                      : "bg-surface border-line text-ink-muted hover:bg-surface-hi hover:border-line-hi hover:text-ink"
                  }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="filter-dot"
                    className={`size-1.5 rounded-full shrink-0
                      ${tab.classes.dot} ${tab.classes.dotGlow}`}
                  />
                )}

                {tab.label}

                <span
                  className={`font-mono text-[10px] px-1.5 py-0.5 rounded
                    transition-colors duration-200
                    ${
                      isActive
                        ? "bg-white/10 text-current"
                        : "bg-surface-top text-ink-faint"
                    }`}
                >
                  {n}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}