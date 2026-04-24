import { SignUp } from "@clerk/nextjs";
import { adminClerkAppearance } from "@/components/auth/clerkAppearance";

export default function SignUpPage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-1.5">
        <span className="inline-flex items-center gap-2 rounded-full border border-svc-data-border bg-svc-data-dim px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-svc-data">
          <span className="size-1.5 rounded-full bg-svc-data shadow-[0_0_6px_var(--color-svc-data)]" />
          Invite-based access
        </span>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink">
          Create your admin account.
        </h2>
        <p className="text-sm text-ink-muted">
          Your email must already be on the Team Access list to reach the dashboard after
          sign-up. Ask an existing admin to add you if you&apos;re not sure.
        </p>
      </div>

      <SignUp
        // appearance={adminClerkAppearance}
        signInUrl="/sign-in"
        fallbackRedirectUrl="/admin"
        forceRedirectUrl="/admin"
      />

      <p className="text-center text-[11px] uppercase tracking-widest text-ink-faint">
        Access is reviewed before every sign-in
      </p>
    </div>
  );
}
