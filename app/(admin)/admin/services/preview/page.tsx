import React from "react";
import { db } from "@/db/drizzle";
import { services } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { requireAdmin } from "@/lib/auth/admin";
import { ServicesHero } from "@/app/(client)/services/_components/ServicesHero";
import { ServicesOverview } from "@/app/(client)/services/_components/ServicesOverview";
import { ServiceDeepDives } from "@/app/(client)/services/_components/ServicesDeepDive";
import { DeliveryProcess } from "@/app/(client)/services/_components/DeliveryProcess";
import { PricingTiers } from "@/app/(client)/services/_components/PricingTiers";
import { FAQ } from "@/app/(client)/services/_components/FAQ";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminServicesPreviewPage() {
  await requireAdmin();

  const serviceList = await db
    .select()
    .from(services)
    // In preview, we might want to show all services including drafts,
    // or we can sort them the same way as the live site.
    .orderBy(asc(services.sortOrder));

  return (
    <div className="rounded-2xl border border-line bg-page overflow-clip">
      {/* Admin Preview Banner */}
      <div className="flex items-center justify-between border-b border-brand/20 bg-brand/5 px-6 py-3 text-sm text-brand">
        <div className="flex items-center gap-4">
          <Link href="/admin/services" className="flex items-center gap-1 font-medium hover:underline">
            <ChevronLeft className="size-4" />
            Back to Dashboard
          </Link>
          <span className="h-4 w-px bg-brand/20"></span>
          <span className="font-semibold">Live Preview: Services Page</span>
        </div>
      </div>

      {/* Main Client Content */}
      <div className="pb-12">
        <ServicesHero />
        <ServicesOverview serviceList={serviceList} />
        <ServiceDeepDives serviceList={serviceList} />
        <DeliveryProcess />
        <PricingTiers />
        <FAQ />
      </div>
    </div>
  );
}
