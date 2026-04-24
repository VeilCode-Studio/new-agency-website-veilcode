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
