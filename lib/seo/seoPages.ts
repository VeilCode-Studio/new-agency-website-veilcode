import type { ContentBlock } from "@/constants/blog";

function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripHtml(text: string) {
  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>\s*<p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .trim();
}

export function parseSeoBodyText(text: string): ContentBlock[] {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      if (part === "---" || part === "***") {
        return { type: "divider" } as ContentBlock;
      }

      if (part.startsWith("## ")) {
        const heading = part.slice(3).trim();
        return { type: "h2", id: slugifyHeading(heading), text: heading } as ContentBlock;
      }

      if (part.startsWith("### ")) {
        const heading = part.slice(4).trim();
        return { type: "h3", id: slugifyHeading(heading), text: heading } as ContentBlock;
      }

      return {
        type: "p",
        html: escapeHtml(part).replace(/\n/g, "<br />"),
      } as ContentBlock;
    });
}

export function serializeSeoBody(blocks: ContentBlock[]) {
  return blocks
    .map((block) => {
      if (block.type === "h2") return `## ${block.text}`;
      if (block.type === "h3") return `### ${block.text}`;
      if (block.type === "divider") return "---";
      if (block.type === "p") return stripHtml(block.html);
      if (block.type === "ul") return block.items.map((item) => `- ${stripHtml(item)}`).join("\n");
      if (block.type === "ol") return block.items.map((item, index) => `${index + 1}. ${stripHtml(item)}`).join("\n");
      if (block.type === "callout") return stripHtml(block.html);
      if (block.type === "code") return block.code;
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}
