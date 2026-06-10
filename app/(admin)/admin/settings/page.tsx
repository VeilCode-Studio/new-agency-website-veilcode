import { PageHeader } from "@/components/admin/PageHeader";
import { ChatbotVisibilityToggle } from "@/components/admin/settings/ChatbotVisibilityToggle";
import { requireAdmin } from "@/lib/auth/admin";
import { getChatbotEnabled } from "@/lib/chatbot/settings.server";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requireAdmin();
  const chatbotEnabled = await getChatbotEnabled();

  return (
    <>
      <PageHeader
        title="Settings"
        description="Control site-wide features and public-facing behavior."
      />

      <div className="space-y-4">
        <ChatbotVisibilityToggle initialEnabled={chatbotEnabled} />

        <div className="max-w-3xl rounded-xl border border-line bg-surface/30 p-4 text-xs leading-relaxed text-ink-muted">
          If this page cannot read the settings table, the public chatbot
          defaults to visible. Run{" "}
          <code className="rounded bg-surface px-1.5 py-0.5 text-ink">
            npx drizzle-kit push
          </code>{" "}
          or apply the latest migration to enable persistent control.
        </div>
      </div>
    </>
  );
}
