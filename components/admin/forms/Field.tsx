import React from "react";

export function Field({
  label,
  required,
  children,
  htmlFor,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-ink-muted" htmlFor={htmlFor}>
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}
