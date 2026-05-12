import React from "react";
import { db } from "@/db/drizzle";
import { projects } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/admin";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { WorkHero } from "@/app/(client)/work/_components/WorkHero";
import { PortfolioGrid } from "@/app/(client)/work/_components/PortfolioGrid";
import { WorkImpact } from "@/app/(client)/work/_components/WorkImpact";
import { CTA } from "@/components/shared/CTA";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPreviewPage() {
  await requireAdmin();

  // In preview, fetch all projects to see how they look in the grid
  const allProjects = await db
    .select()
    .from(projects)
    .orderBy(asc(projects.sortOrder));

  return (
    <div className="rounded-2xl border border-line bg-page overflow-clip">
      {/* Admin Preview Banner */}
      <div className="flex items-center justify-between border-b border-brand/20 bg-brand/5 px-6 py-3 text-sm text-brand">
        <div className="flex items-center gap-4">
          <Link href="/admin/projects" className="flex items-center gap-1 font-medium hover:underline">
            <ChevronLeft className="size-4" />
            Back to Dashboard
          </Link>
          <span className="h-4 w-px bg-brand/20"></span>
          <span className="font-semibold">Live Preview: Projects Page</span>
        </div>
      </div>

      {/* Main Client Content */}
      <div className="pb-12">
        <WorkHero />
        <PortfolioGrid projects={allProjects} />
        <WorkImpact />
        <CTA />
      </div>
    </div>
  );
}