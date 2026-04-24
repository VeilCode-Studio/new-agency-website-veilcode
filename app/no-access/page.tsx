import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert, Mail, LogOut, ArrowLeft } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { SignOutButton } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Access pending",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NoAccessPage() {
  const user = await currentUser();
  const email = user?.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId,
  )?.emailAddress;

  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-page px-5 py-14 text-ink">
      {/* ambient glow */}
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-24 left-1/4 size-96 rounded-full bg-svc-social-dim blur-3xl" />
        <div className="absolute bottom-0 right-1/4 size-96 rounded-full bg-brand-dim blur-3xl" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #F0F4F8 1px, transparent 1px), linear-gradient(to bottom, #F0F4F8 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <Link href="/" className="mb-8 inline-flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-lg border border-brand-border bg-brand-dim font-display text-base font-bold text-brand shadow-[0_0_24px_var(--color-brand-dim)]">
            V
          </span>
          <div className="flex flex-col leading-tight">
            <span className="font-display text-sm font-semibold tracking-wide text-ink">
              VeilCode
            </span>
            <span className="text-[11px] uppercase tracking-widest text-ink-muted">
              Admin Console
            </span>
          </div>
        </Link>

        <div className="rounded-2xl border border-line bg-surface/60 p-6 shadow-[0_0_48px_-24px_var(--color-svc-social-dim)] backdrop-blur md:p-8">
          <div className="flex items-start gap-4">
            <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-svc-social-border bg-svc-social-dim text-svc-social">
              <ShieldAlert className="size-5" />
            </div>
            <div className="flex-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-svc-social-border bg-svc-social-dim px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-svc-social">
                Access pending
              </span>
              <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-ink">
                You&apos;re signed in, but not yet an admin.
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                Admin access to the VeilCode dashboard is granted by existing admins.
                Ask one of them to add your email on the Team Access page and you&apos;ll be let
                straight in on your next sign-in.
              </p>
            </div>
          </div>

          {email && (
            <div className="mt-6 flex items-center gap-3 rounded-lg border border-line bg-page px-3 py-2.5">
              <Mail className="size-4 shrink-0 text-ink-muted" />
              <div className="min-w-0 flex-1">
                <div className="text-[11px] uppercase tracking-widest text-ink-faint">
                  Signed in as
                </div>
                <div className="truncate text-sm text-ink">{email}</div>
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-md border border-line bg-surface-hi px-3 py-2 text-sm text-ink transition-colors hover:border-line-hi hover:bg-surface-top"
            >
              <ArrowLeft className="size-4" />
              Back to site
            </Link>
            {user && (
              <SignOutButton redirectUrl="/sign-in">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-md border border-line px-3 py-2 text-sm text-ink-muted transition-colors hover:border-destructive/50 hover:text-destructive"
                >
                  <LogOut className="size-4" />
                  Sign out &amp; try another email
                </button>
              </SignOutButton>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-[11px] uppercase tracking-widest text-ink-faint">
          Internal · Access is reviewed before every sign-in
        </p>
      </div>
    </div>
  );
}
