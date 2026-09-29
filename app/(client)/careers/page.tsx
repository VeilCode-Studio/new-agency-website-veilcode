import { eq, asc } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { jobOpenings } from "@/db/schema";
import NoCareersOpenings from "./_components/NoCareerOpenings";
import CareersCTA from "./_components/CareersCTA";
import AvailableCareers from "./_components/AvailableCareers";
import { CareersHero } from "./_components/CareersHero";

export const dynamic = "force-dynamic";

// Kept out of the index and the sitemap while there are no published
// openings. To index it: swap this for buildPageMetadata({ path: "/careers", ... })
// and add "/careers" to STATIC_PAGE_LASTMOD in app/sitemap.ts.
export const metadata = {
  robots: { index: false, follow: true },
};

function timeAgo(date: Date): string {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / 86_400_000);
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week ago";
  if (weeks < 5) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  return months === 1 ? "1 month ago" : `${months} months ago`;
}

export default async function CareersPage() {
  let openings: JobOpening[] = [];

  try {
    const rows = await db
      .select()
      .from(jobOpenings)
      .where(eq(jobOpenings.published, true))
      .orderBy(asc(jobOpenings.createdAt));

    openings = rows.map((r) => ({
      id: r.id,
      title: r.title,
      department: r.department,
      location: r.location,
      type: r.type,
      experience: r.experience,
      description: r.description,
      responsibilities: r.responsibilities,
      posted: timeAgo(r.createdAt),
    }));
  } catch {
    // Table may not exist yet — fall through to empty state
  }

  const hasOpenings = openings.length > 0;

  return (
    <div className="min-h-screen bg-page pt-20 pb-24">
      <CareersHero />

      <div className="max-w-5xl mx-auto px-6">
        {hasOpenings ? (
          <AvailableCareers openings={openings} />
        ) : (
          <NoCareersOpenings />
        )}
        <CareersCTA />
      </div>
    </div>
  );
}
