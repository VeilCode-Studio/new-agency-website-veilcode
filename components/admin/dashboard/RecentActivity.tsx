import Link from "next/link";
import { db } from "@/db/drizzle";
import { projects, services, blogPosts, clientInquiries } from "@/db/schema";
import { desc, asc } from "drizzle-orm";

function formatDistanceToNow(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}

async function getRecentData() {
  try {
    const [recentProjects, recentServices, recentBlogs, recentInquiries] = await Promise.all([
      db.select({ id: projects.id, title: projects.title, published: projects.published, updatedAt: projects.updatedAt })
        .from(projects)
        .orderBy(desc(projects.updatedAt))
        .limit(5),
      db.select({ id: services.id, title: services.title, published: services.published, updatedAt: services.updatedAt })
        .from(services)
        .orderBy(asc(services.sortOrder))
        .limit(5),
      db.select({ id: blogPosts.id, title: blogPosts.title, published: blogPosts.published, publishedAt: blogPosts.publishedAt })
        .from(blogPosts)
        .orderBy(desc(blogPosts.publishedAt))
        .limit(5),
      db.select({ id: clientInquiries.id, name: clientInquiries.name, email: clientInquiries.email, service: clientInquiries.service, createAt: clientInquiries.createAt })
        .from(clientInquiries)
        .orderBy(desc(clientInquiries.createAt))
        .limit(5),
    ]);
    return { recentProjects, recentServices, recentBlogs, recentInquiries, error: false };
  } catch (error) {
    console.warn("Failed to fetch recent activity:", error);
    return { recentProjects: [], recentServices: [], recentBlogs: [], recentInquiries: [], error: true };
  }
}

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "Unknown";
  return formatDistanceToNow(new Date(date));
}

export async function RecentActivity() {
  const { recentProjects, recentServices, recentBlogs, recentInquiries, error } = await getRecentData();

  if (error) {
    return null; // Handle missing tables gracefully, similar to the main page
  }

  return (
    <div className="mt-10 grid gap-4 lg:grid-cols-2">
      {/* Projects */}
      <div className="rounded-xl border border-line bg-surface/40 overflow-hidden flex flex-col">
        <div className="border-b border-line px-5 py-4 flex items-center justify-between bg-surface/60">
          <h2 className="font-display text-sm font-semibold tracking-wide text-ink">Recent Projects</h2>
          <Link href="/admin/projects" className="text-[11px] font-medium text-brand hover:underline">View all</Link>
        </div>
        <div className="flex-1 p-0">
          {recentProjects.length === 0 ? (
            <p className="p-5 text-sm text-ink-muted">No projects found.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentProjects.map(p => (
                <li key={p.id} className="flex items-center justify-between px-5 py-3 hover:bg-surface-hi transition-colors">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-medium text-ink truncate">{p.title}</p>
                    <p className="text-[11px] text-ink-faint mt-0.5">Updated {formatDate(p.updatedAt)}</p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${p.published ? 'bg-svc-web-dim text-svc-web border border-svc-web-border' : 'bg-surface-hi text-ink-muted border border-line'}`}>
                    {p.published ? 'Published' : 'Draft'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Services */}
      <div className="rounded-xl border border-line bg-surface/40 overflow-hidden flex flex-col">
        <div className="border-b border-line px-5 py-4 flex items-center justify-between bg-surface/60">
          <h2 className="font-display text-sm font-semibold tracking-wide text-ink">Current Services</h2>
          <Link href="/admin/services" className="text-[11px] font-medium text-brand hover:underline">View all</Link>
        </div>
        <div className="flex-1 p-0">
          {recentServices.length === 0 ? (
            <p className="p-5 text-sm text-ink-muted">No services found.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentServices.map(s => (
                <li key={s.id} className="flex items-center justify-between px-5 py-3 hover:bg-surface-hi transition-colors">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-medium text-ink truncate">{s.title}</p>
                    <p className="text-[11px] text-ink-faint mt-0.5">Updated {formatDate(s.updatedAt)}</p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${s.published ? 'bg-svc-data-dim text-svc-data border border-svc-data-border' : 'bg-surface-hi text-ink-muted border border-line'}`}>
                    {s.published ? 'Published' : 'Draft'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Blog Posts */}
      <div className="rounded-xl border border-line bg-surface/40 overflow-hidden flex flex-col">
        <div className="border-b border-line px-5 py-4 flex items-center justify-between bg-surface/60">
          <h2 className="font-display text-sm font-semibold tracking-wide text-ink">Recent Blog Posts</h2>
          <Link href="/admin/blog" className="text-[11px] font-medium text-brand hover:underline">View all</Link>
        </div>
        <div className="flex-1 p-0">
          {recentBlogs.length === 0 ? (
            <p className="p-5 text-sm text-ink-muted">No blog posts found.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentBlogs.map(b => (
                <li key={b.id} className="flex items-center justify-between px-5 py-3 hover:bg-surface-hi transition-colors">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-medium text-ink truncate">{b.title}</p>
                    <p className="text-[11px] text-ink-faint mt-0.5">Published {formatDate(b.publishedAt)}</p>
                  </div>
                  <span className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${b.published ? 'bg-svc-mobile-dim text-svc-mobile border border-svc-mobile-border' : 'bg-surface-hi text-ink-muted border border-line'}`}>
                    {b.published ? 'Published' : 'Draft'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Inquiries */}
      <div className="rounded-xl border border-line bg-surface/40 overflow-hidden flex flex-col">
        <div className="border-b border-line px-5 py-4 flex items-center justify-between bg-surface/60">
          <h2 className="font-display text-sm font-semibold tracking-wide text-ink">Latest Inquiries</h2>
          <Link href="/admin/inquiries" className="text-[11px] font-medium text-brand hover:underline">View all</Link>
        </div>
        <div className="flex-1 p-0">
          {recentInquiries.length === 0 ? (
            <p className="p-5 text-sm text-ink-muted">No inquiries yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {recentInquiries.map(i => (
                <li key={i.id} className="flex items-center justify-between px-5 py-3 hover:bg-surface-hi transition-colors">
                  <div className="min-w-0 pr-4">
                    <p className="text-sm font-medium text-ink truncate">{i.name}</p>
                    <p className="text-[11px] text-ink-faint mt-0.5 truncate">{i.email}</p>
                  </div>
                  <span className="shrink-0 inline-flex items-center rounded-md px-2 py-1 text-[10px] font-mono tracking-widest uppercase bg-surface-hi text-ink-muted border border-line">
                    {i.service.substring(0, 15)}{i.service.length > 15 ? '...' : ''}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
