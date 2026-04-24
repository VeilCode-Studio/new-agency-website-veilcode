import type { BlogAuthor, TocEntry, ContentBlock } from "@/constants/blog";

export type BlogPostClasses = {
  accent: string;
  dimBg: string;
  border: string;
};

export type ProjectClasses = {
  accent: string;
  dimBg: string;
  border: string;
  hoverBorder: string;
  hoverShadow: string;
  gradFrom: string;
};

export type ServiceCardClasses = {
  icon: string;
  tag: string;
  glow: string;
  hoverBorder: string;
  hoverShadow: string;
  link: string;
};

export type ServiceOverviewClasses = {
  accent: string;
  dimBg: string;
  border: string;
  hoverBorder: string;
  hoverShadow: string;
};

export type ServiceDeepDiveClasses = {
  accent: string;
  dimBg: string;
  border: string;
  glow: string;
  stackBg: string;
  stackBorder: string;
  metricText: string;
  divider: string;
};

export type BlogAuthorJSON = BlogAuthor;
export type TocEntryJSON = TocEntry;
export type ContentBlockJSON = ContentBlock;

// Email campaign blocks

export type EmailHeadingBlock = { type: "heading"; text: string; level: 1 | 2 | 3 };
export type EmailTextBlock    = { type: "text"; html: string };
export type EmailButtonBlock  = { type: "button"; label: string; url: string; align: "left" | "center" | "right" };
export type EmailDividerBlock = { type: "divider" };
export type EmailQuoteBlock   = { type: "quote"; text: string; attribution?: string };
export type EmailListBlock    = { type: "list"; items: string[]; ordered?: boolean };
export type EmailImageBlock   = { type: "image"; src: string; alt: string; caption?: string; link?: string };
export type EmailSpacerBlock  = { type: "spacer"; size: "sm" | "md" | "lg" };

export type EmailBlock =
  | EmailHeadingBlock
  | EmailTextBlock
  | EmailButtonBlock
  | EmailDividerBlock
  | EmailQuoteBlock
  | EmailListBlock
  | EmailImageBlock
  | EmailSpacerBlock;
