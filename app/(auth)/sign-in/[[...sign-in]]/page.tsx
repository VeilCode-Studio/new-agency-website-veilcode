import { ThemedSignIn } from "@/components/auth/ThemedSignIn";

export default function SignInPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-1.5">
        <span className="inline-flex items-center gap-2 rounded-full border border-brand-border bg-brand-dim px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-brand">
          <span className="size-1.5 rounded-full bg-brand shadow-[0_0_6px_var(--color-brand)]" />
          Secure Login
        </span>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Welcome back.
        </h2>
        <p className="text-sm text-ink-muted">
          Sign in to manage VeilCode&apos;s public content and team access.
        </p>
      </div>

      <ThemedSignIn />

      <p className="text-center text-[11px] uppercase tracking-widest text-ink-faint">
        Admin-only area · All access is logged
      </p>
    </div>
  );
}
