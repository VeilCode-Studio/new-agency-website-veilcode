import { requireAdmin } from "@/lib/auth/admin";
import { BlogPostForm } from "@/components/admin/blog/BlogPostForm";

export const dynamic = "force-dynamic";

export default async function NewBlogPostPage() {
  await requireAdmin();

  return (
    <div className="mx-auto max-w-4xl">
      <BlogPostForm mode="create" />
    </div>
  );
}
