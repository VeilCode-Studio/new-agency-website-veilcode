"use client";

import { useActionState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { addAdminAction, type AddAdminState } from "./actions";

const initialState: AddAdminState = { ok: false };

export function AddAdminForm() {
  const [state, formAction, pending] = useActionState(addAdminAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      toast.success("Admin added");
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="flex flex-wrap items-end gap-3 rounded-xl border border-line bg-surface/40 p-4"
    >
      <div className="flex-1 min-w-[220px]">
        <Label htmlFor="email" className="text-xs text-ink-muted">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="off"
          placeholder="teammate@example.com"
          className="mt-1"
        />
      </div>
      <div className="flex-1 min-w-[180px]">
        <Label htmlFor="name" className="text-xs text-ink-muted">
          Name (optional)
        </Label>
        <Input
          id="name"
          name="name"
          type="text"
          autoComplete="off"
          placeholder="Jane Doe"
          className="mt-1"
        />
      </div>
      <Button type="submit" variant="default" disabled={pending}>
        {pending ? "Adding…" : "Grant admin access"}
      </Button>
    </form>
  );
}
