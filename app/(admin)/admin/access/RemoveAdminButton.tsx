"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { removeAdminAction } from "./actions";

export function RemoveAdminButton({
  id,
  email,
  disabled,
}: {
  id: number;
  email: string;
  disabled?: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={disabled || pending}
      onClick={() => {
        if (!confirm(`Revoke admin access for ${email}?`)) return;
        const fd = new FormData();
        fd.set("id", String(id));
        startTransition(async () => {
          try {
            await removeAdminAction(fd);
            toast.success(`${email} removed`);
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to remove admin");
          }
        });
      }}
      className="rounded-md border border-line px-2 py-1 text-xs text-ink-muted transition-colors hover:border-destructive/50 hover:text-destructive disabled:opacity-40"
    >
      {pending ? "Removing…" : "Revoke"}
    </button>
  );
}
