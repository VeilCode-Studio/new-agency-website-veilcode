"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus, Trash2, ChevronUp, ChevronDown, Send, Save,
  Loader2, Type, AlignLeft, Square, Minus, Quote, List, Image as ImageIcon, Space,
  CheckCircle2, AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EmailBlock } from "@/types/content";

export type CampaignFormData = {
  subject: string;
  previewText: string;
  type: "announcement" | "product-update" | "tips-tricks" | "blog-digest" | "custom";
  body: EmailBlock[];
};

type Props =
  | { mode: "create" }
  | {
      mode: "edit";
      id: number;
      initialData: CampaignFormData;
      status: string;
      sentAt: Date | null;
      sentCount: number;
      failedCount: number;
    };

const CAMPAIGN_TYPES = [
  { value: "announcement",  label: "Announcement" },
  { value: "product-update",label: "Product Update" },
  { value: "tips-tricks",   label: "Tips & Tricks" },
  { value: "blog-digest",   label: "Blog Digest" },
  { value: "custom",        label: "Custom" },
] as const;

const BLOCK_TYPES: { type: EmailBlock["type"]; label: string; icon: React.ElementType }[] = [
  { type: "heading",  label: "Heading",  icon: Type },
  { type: "text",     label: "Text",     icon: AlignLeft },
  { type: "button",   label: "Button",   icon: Square },
  { type: "divider",  label: "Divider",  icon: Minus },
  { type: "quote",    label: "Quote",    icon: Quote },
  { type: "list",     label: "List",     icon: List },
  { type: "image",    label: "Image",    icon: ImageIcon },
  { type: "spacer",   label: "Spacer",   icon: Space },
];

function defaultBlock(type: EmailBlock["type"]): EmailBlock {
  switch (type) {
    case "heading":  return { type, text: "", level: 2 };
    case "text":     return { type, html: "" };
    case "button":   return { type, label: "", url: "", align: "left" };
    case "divider":  return { type };
    case "quote":    return { type, text: "", attribution: "" };
    case "list":     return { type, items: [""], ordered: false };
    case "image":    return { type, src: "", alt: "", caption: "", link: "" };
    case "spacer":   return { type, size: "md" };
  }
}

function BlockEditor({
  block,
  onChange,
}: {
  block: EmailBlock;
  onChange: (updated: EmailBlock) => void;
}) {
  const inputCls = "w-full rounded-md border border-line bg-surface/60 px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-brand/40";
  const labelCls = "block text-[10px] font-semibold uppercase tracking-wider text-ink-faint mb-1";

  switch (block.type) {
    case "heading":
      return (
        <div className="space-y-2">
          <div>
            <label className={labelCls}>Text</label>
            <input
              className={inputCls}
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              placeholder="Heading text"
            />
          </div>
          <div>
            <label className={labelCls}>Level</label>
            <select
              className={inputCls}
              value={block.level}
              onChange={(e) => onChange({ ...block, level: Number(e.target.value) as 1 | 2 | 3 })}
            >
              <option value={1}>H1 — Large</option>
              <option value={2}>H2 — Medium</option>
              <option value={3}>H3 — Small</option>
            </select>
          </div>
        </div>
      );

    case "text":
      return (
        <div>
          <label className={labelCls}>HTML content</label>
          <textarea
            className={cn(inputCls, "min-h-[100px] font-mono text-xs resize-y")}
            value={block.html}
            onChange={(e) => onChange({ ...block, html: e.target.value })}
            placeholder="Paragraph text — basic HTML allowed: <b>, <a href=&quot;...&quot;>, <br>"
          />
        </div>
      );

    case "button":
      return (
        <div className="space-y-2">
          <div>
            <label className={labelCls}>Label</label>
            <input
              className={inputCls}
              value={block.label}
              onChange={(e) => onChange({ ...block, label: e.target.value })}
              placeholder="Button label"
            />
          </div>
          <div>
            <label className={labelCls}>URL</label>
            <input
              className={inputCls}
              value={block.url}
              onChange={(e) => onChange({ ...block, url: e.target.value })}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className={labelCls}>Alignment</label>
            <select
              className={inputCls}
              value={block.align}
              onChange={(e) => onChange({ ...block, align: e.target.value as "left" | "center" | "right" })}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
      );

    case "divider":
      return (
        <p className="text-xs text-ink-faint italic">
          A horizontal rule — no configuration needed.
        </p>
      );

    case "quote":
      return (
        <div className="space-y-2">
          <div>
            <label className={labelCls}>Quote text</label>
            <textarea
              className={cn(inputCls, "min-h-[72px] resize-y")}
              value={block.text}
              onChange={(e) => onChange({ ...block, text: e.target.value })}
              placeholder="Quote text"
            />
          </div>
          <div>
            <label className={labelCls}>Attribution (optional)</label>
            <input
              className={inputCls}
              value={block.attribution ?? ""}
              onChange={(e) => onChange({ ...block, attribution: e.target.value })}
              placeholder="— Author name"
            />
          </div>
        </div>
      );

    case "list": {
      const items = block.items;
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <label className={labelCls}>Items</label>
            <label className="ml-auto flex items-center gap-1.5 text-xs text-ink-muted cursor-pointer">
              <input
                type="checkbox"
                checked={block.ordered ?? false}
                onChange={(e) => onChange({ ...block, ordered: e.target.checked })}
                className="accent-brand"
              />
              Ordered list
            </label>
          </div>
          <div className="space-y-1.5">
            {items.map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-xs text-ink-faint w-4 shrink-0 text-right">{i + 1}.</span>
                <input
                  className={cn(inputCls, "flex-1")}
                  value={item}
                  onChange={(e) => {
                    const next = [...items];
                    next[i] = e.target.value;
                    onChange({ ...block, items: next });
                  }}
                  placeholder={`Item ${i + 1}`}
                />
                <button
                  type="button"
                  onClick={() => onChange({ ...block, items: items.filter((_, j) => j !== i) })}
                  disabled={items.length <= 1}
                  className="shrink-0 rounded p-1 text-ink-faint hover:text-destructive disabled:opacity-30"
                >
                  <Trash2 className="size-3" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onChange({ ...block, items: [...items, ""] })}
            className="flex items-center gap-1 text-xs text-brand hover:underline"
          >
            <Plus className="size-3" /> Add item
          </button>
        </div>
      );
    }

    case "image":
      return (
        <div className="space-y-2">
          <div>
            <label className={labelCls}>Image URL</label>
            <input
              className={inputCls}
              value={block.src}
              onChange={(e) => onChange({ ...block, src: e.target.value })}
              placeholder="https://res.cloudinary.com/..."
            />
          </div>
          <div>
            <label className={labelCls}>Alt text</label>
            <input
              className={inputCls}
              value={block.alt}
              onChange={(e) => onChange({ ...block, alt: e.target.value })}
              placeholder="Describe the image"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className={labelCls}>Caption (optional)</label>
              <input
                className={inputCls}
                value={block.caption ?? ""}
                onChange={(e) => onChange({ ...block, caption: e.target.value })}
                placeholder="Image caption"
              />
            </div>
            <div>
              <label className={labelCls}>Link URL (optional)</label>
              <input
                className={inputCls}
                value={block.link ?? ""}
                onChange={(e) => onChange({ ...block, link: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
        </div>
      );

    case "spacer":
      return (
        <div>
          <label className={labelCls}>Size</label>
          <select
            className={inputCls}
            value={block.size}
            onChange={(e) => onChange({ ...block, size: e.target.value as "sm" | "md" | "lg" })}
          >
            <option value="sm">Small (16px)</option>
            <option value="md">Medium (32px)</option>
            <option value="lg">Large (48px)</option>
          </select>
        </div>
      );
  }
}

const BLOCK_LABEL: Record<string, string> = {
  heading: "Heading", text: "Text", button: "Button",
  divider: "Divider", quote: "Quote", list: "List",
  image: "Image", spacer: "Spacer",
};

export function CampaignForm(props: Props) {
  const router = useRouter();
  const isEdit = props.mode === "edit";
  const editProps = isEdit ? props : null;

  const initial: CampaignFormData = isEdit
    ? props.initialData
    : { subject: "", previewText: "", type: "custom", body: [] };

  const [data, setData] = useState<CampaignFormData>(initial);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [confirmSend, setConfirmSend] = useState(false);
  const [isPending, startTransition] = useTransition();

  function patch(partial: Partial<CampaignFormData>) {
    setData((prev) => ({ ...prev, ...partial }));
  }

  function updateBlock(i: number, updated: EmailBlock) {
    const next = [...data.body];
    next[i] = updated;
    patch({ body: next });
  }

  function removeBlock(i: number) {
    patch({ body: data.body.filter((_, j) => j !== i) });
  }

  function moveBlock(i: number, dir: "up" | "down") {
    const next = [...data.body];
    const swap = dir === "up" ? i - 1 : i + 1;
    if (swap < 0 || swap >= next.length) return;
    [next[i], next[swap]] = [next[swap], next[i]];
    patch({ body: next });
  }

  function addBlock(type: EmailBlock["type"]) {
    patch({ body: [...data.body, defaultBlock(type)] });
    setShowAddBlock(false);
  }

  async function handleSave() {
    if (!data.subject.trim()) {
      toast.error("Subject line is required");
      return;
    }
    setIsSaving(true);
    try {
      const url = isEdit
        ? `/api/admin/newsletter/campaigns/${editProps!.id}`
        : "/api/admin/newsletter/campaigns";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Save failed");
      }
      const saved = await res.json();
      toast.success(isEdit ? "Campaign saved" : "Campaign created");
      if (!isEdit) router.push(`/admin/newsletter/campaigns/${saved.id}/edit`);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsSaving(false);
    }
  }

  function handleSend() {
    if (!data.subject.trim()) {
      toast.error("Subject line is required before sending");
      return;
    }
    if (data.body.length === 0) {
      toast.error("Add at least one block before sending");
      return;
    }
    setConfirmSend(true);
  }

  async function confirmAndSend() {
    setConfirmSend(false);
    setIsSending(true);
    //  save first if unsaved changes might exist, then send
    try {
      if (isEdit) {
        const saveRes = await fetch(`/api/admin/newsletter/campaigns/${editProps!.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!saveRes.ok) throw new Error("Failed to save before sending");
      }

      const id = isEdit ? editProps!.id : null;
      if (!id) {
        toast.error("Save the campaign first, then send");
        return;
      }

      const res = await fetch(`/api/admin/newsletter/campaigns/${id}/send`, { method: "POST" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error ?? "Send failed");

      toast.success(`Campaign sent to ${result.sent} subscriber${result.sent === 1 ? "" : "s"}${result.failed > 0 ? ` (${result.failed} failed)` : ""}`);
      startTransition(() => router.push("/admin/newsletter/campaigns"));
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setIsSending(false);
    }
  }

  const isSent = isEdit && editProps!.status === "sent";
  const isSending_ = isEdit && editProps!.status === "sending";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_272px]">
      {/* Main area */}
      <div className="space-y-6">
        {/* Metadata card */}
        <div className="rounded-xl border border-line bg-surface/40 p-5 space-y-4">
          <h2 className="text-sm font-semibold text-ink">Campaign details</h2>

          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">
              Subject line <span className="text-destructive">*</span>
            </label>
            <input
              className="w-full rounded-lg border border-line bg-surface/60 px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-brand/40"
              value={data.subject}
              onChange={(e) => patch({ subject: e.target.value })}
              placeholder="Your email subject line"
              disabled={isSent}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">
              Preview text
              <span className="ml-1.5 font-normal text-ink-faint">(shown in email clients before opening)</span>
            </label>
            <input
              className="w-full rounded-lg border border-line bg-surface/60 px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-1 focus:ring-brand/40"
              value={data.previewText}
              onChange={(e) => patch({ previewText: e.target.value })}
              placeholder="Short teaser shown in inbox previews…"
              disabled={isSent}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1.5">Campaign type</label>
            <select
              className="w-full rounded-lg border border-line bg-surface/60 px-3 py-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-brand/40"
              value={data.type}
              onChange={(e) => patch({ type: e.target.value as CampaignFormData["type"] })}
              disabled={isSent}
            >
              {CAMPAIGN_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Email body editor */}
        <div className="rounded-xl border border-line bg-surface/40 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-ink">Email body</h2>
            <span className="text-xs text-ink-faint">{data.body.length} block{data.body.length === 1 ? "" : "s"}</span>
          </div>

          {data.body.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-line py-12 text-center">
              <p className="text-sm text-ink-muted">No blocks yet</p>
              <p className="mt-1 text-xs text-ink-faint">Add blocks below to compose your email</p>
            </div>
          )}

          <div className="space-y-3">
            {data.body.map((block, i) => (
              <div
                key={i}
                className="rounded-lg border border-line bg-surface/60 p-4"
              >
                {/* Block header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                    {BLOCK_LABEL[block.type] ?? block.type}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveBlock(i, "up")}
                      disabled={i === 0 || isSent}
                      className="rounded p-0.5 text-ink-faint hover:text-ink disabled:opacity-20"
                    >
                      <ChevronUp className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveBlock(i, "down")}
                      disabled={i === data.body.length - 1 || isSent}
                      className="rounded p-0.5 text-ink-faint hover:text-ink disabled:opacity-20"
                    >
                      <ChevronDown className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeBlock(i)}
                      disabled={isSent}
                      className="rounded p-0.5 text-ink-faint hover:text-destructive disabled:opacity-20"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>

                <BlockEditor
                  block={block}
                  onChange={(updated) => updateBlock(i, updated)}
                />
              </div>
            ))}
          </div>

          {/* Add block */}
          {!isSent && (
            <div className="mt-4">
              {showAddBlock ? (
                <div className="rounded-lg border border-brand/20 bg-brand-dim/20 p-3">
                  <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                    Choose block type
                  </p>
                  <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                    {BLOCK_TYPES.map(({ type, label, icon: Icon }) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => addBlock(type)}
                        className="flex flex-col items-center gap-1.5 rounded-md border border-line bg-surface/60 px-2 py-2.5 text-center transition-colors hover:border-brand-border hover:bg-brand-dim/30"
                      >
                        <Icon className="size-4 text-ink-muted" />
                        <span className="text-[10px] text-ink-faint">{label}</span>
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddBlock(false)}
                    className="mt-2.5 text-xs text-ink-faint hover:text-ink"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddBlock(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-line py-2.5 text-xs text-ink-muted transition-colors hover:border-brand/30 hover:text-brand"
                >
                  <Plus className="size-3.5" /> Add block
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Status card */}
        {isEdit && (
          <div className="rounded-xl border border-line bg-surface/40 p-4 space-y-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint">Campaign status</p>
            <div className="flex items-center gap-2">
              {editProps!.status === "sent"    && <CheckCircle2 className="size-4 text-emerald-500" />}
              {editProps!.status === "draft"   && <Save className="size-4 text-ink-muted" />}
              {editProps!.status === "sending" && <Loader2 className="size-4 animate-spin text-amber-500" />}
              {editProps!.status === "failed"  && <AlertCircle className="size-4 text-destructive" />}
              <span className="capitalize text-sm font-medium text-ink">{editProps!.status}</span>
            </div>
            {editProps!.status === "sent" && (
              <div className="space-y-1 text-xs text-ink-muted">
                <div>Sent to <span className="font-medium text-ink">{editProps!.sentCount.toLocaleString()}</span> subscriber{editProps!.sentCount === 1 ? "" : "s"}</div>
                {editProps!.failedCount > 0 && (
                  <div className="text-destructive">{editProps!.failedCount} failed deliveries</div>
                )}
                {editProps!.sentAt && (
                  <div className="text-ink-faint">
                    {new Date(editProps!.sentAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="rounded-xl border border-line bg-surface/40 p-4 space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint mb-3">Actions</p>

          {!isSent && !isSending_ && (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || isPending}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-line bg-surface/60 px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-hi disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
              {isSaving ? "Saving…" : "Save draft"}
            </button>
          )}

          {isEdit && !isSent && !isSending_ && (
            <>
              {confirmSend ? (
                <div className="rounded-lg border border-brand/20 bg-brand-dim/20 p-3 space-y-2">
                  <p className="text-xs text-ink-muted">
                    This will send to all confirmed subscribers. Are you sure?
                  </p>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmSend(false)}
                      className="flex-1 rounded-md border border-line px-3 py-1.5 text-xs text-ink-muted hover:text-ink"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={confirmAndSend}
                      disabled={isSending}
                      className="flex-1 rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-50"
                    >
                      {isSending ? "Sending…" : "Send now"}
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isSending || isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isSending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  {isSending ? "Sending…" : "Send campaign"}
                </button>
              )}
            </>
          )}

          {isSending_ && (
            <div className="flex items-center gap-2 text-sm text-amber-600">
              <Loader2 className="size-4 animate-spin" />
              Send in progress…
            </div>
          )}
        </div>

        {/* Block count summary */}
        {data.body.length > 0 && (
          <div className="rounded-xl border border-line bg-surface/40 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-ink-faint mb-3">Block summary</p>
            <div className="space-y-1">
              {Object.entries(
                data.body.reduce<Record<string, number>>((acc, b) => {
                  acc[b.type] = (acc[b.type] ?? 0) + 1;
                  return acc;
                }, {}),
              ).map(([type, count]) => (
                <div key={type} className="flex justify-between text-xs">
                  <span className="capitalize text-ink-muted">{BLOCK_LABEL[type] ?? type}</span>
                  <span className="font-medium text-ink">{count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
