import {
  text,
  boolean,
  pgTable,
  serial,
  timestamp,
  pgEnum,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";
import type { BlogAuthor, TocEntry, ContentBlock } from "@/constants/blog";
import type {
  BlogPostClasses,
  ProjectClasses,
  ServiceCardClasses,
  ServiceOverviewClasses,
  ServiceDeepDiveClasses,
  EmailBlock,
  SeoFaq,
} from "@/types/content";

// Newsletter subscriptions

export const newsletterSubscriptionTable = pgTable("newsletter_subscription", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  subscribed: boolean("subscribed").default(false).notNull(),
  confirmToken: text("confirm_token").unique(),
  confirmTokenExpiresAt: timestamp("confirm_token_expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// ENUMS

export const budgetEnum = pgEnum("budget", [
  "Under $1,500",
  "$1,500 – $5,000",
  "$5,000 – $15,000",
  "$15,000 – $30,000",
  "$30,000 - $60,000",
  "$60,000",
  "Let's Discuss",
]);

export const timelineEnum = pgEnum("timelines", [
  "ASAP — urgent project",
  "Within 1 month",
  "1–3 months",
  "3–6 months",
  "Just exploring for now",
]);

export const servicesEnum = pgEnum("services_type", [
  "Web Solutions (Design & Development)",
  "Mobile Application Development",
  "Data Analytics",
  "Social Media Marketing",
  "AI Automation",
  "Multiple Services",
  "Not Sure Yet",
]);

export const goalsEnum = pgEnum("goals", [
  "Increase revenue",
  "Reduce manual work",
  "Launch a new product",
  "Improve user experience",
  "Scale existing systems",
  "Enter a new market",
  "Build internal tools",
  "Data-driven decisions",
]);

export const serviceSlugEnum = pgEnum("service_slug", [
  "web",
  "mobile",
  "data",
  "social",
  "ai",
]);

// Client inquiries

export const clientInquiries = pgTable("client_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  service: text("service").notNull(),
  company: text("company"),
  budget: budgetEnum("budget"),
  timeline: timelineEnum("timelines"),
  message: text("message").notNull(),
  goals: goalsEnum("goals").array(),
  createAt: timestamp("created_at").defaultNow(),
});

// ADMINS

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").unique(),
  email: text("email").unique().notNull(),
  name: text("name"),
  addedBy: text("added_by"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// JOB OPENINGS

export const jobOpenings = pgTable("job_openings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  department: text("department").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  experience: text("experience").notNull(),
  description: text("description").notNull(),
  responsibilities: text("responsibilities").array().notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// SERVICES

export const services = pgTable("services", {
  id: text("id").primaryKey(),
  number: text("number").notNull(),
  icon: text("icon").notNull(),
  title: text("title").notNull(),
  slug: text("slug").unique(),
  seoTitle: text("seo_title"),
  metaDescription: text("meta_description"),
  h1: text("h1"),
  tagline: text("tagline").notNull(),
  desc: text("desc").notNull(),
  intro: text("intro").notNull(),
  challenge: text("challenge").notNull(),
  approach: text("approach").notNull(),
  bullets: text("bullets").array().notNull(),
  deliverables: jsonb("deliverables").$type<DeliverableItem[]>().notNull(),
  stack: text("stack").array().notNull(),
  tags: text("tags").array().notNull(),
  metric: text("metric").notNull(),
  metricLabel: text("metric_label").notNull(),
  metricSub: text("metric_sub").notNull(),
  supportingCapabilities: text("supporting_capabilities").array().default([]).notNull(),
  faqs: jsonb("faqs").$type<SeoFaq[]>().default([]).notNull(),
  seoEnabled: boolean("seo_enabled").default(false).notNull(),
  cardClasses: jsonb("card_classes").$type<ServiceCardClasses>().notNull(),
  overviewClasses: jsonb("overview_classes").$type<ServiceOverviewClasses>().notNull(),
  deepDiveClasses: jsonb("deep_dive_classes").$type<ServiceDeepDiveClasses>().notNull(),
  sortOrder: integer("sort_order").notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Service = typeof services.$inferSelect;

// PROJECTS

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  service: serviceSlugEnum("service").notNull(),
  serviceLabel: text("service_label").notNull(),
  year: text("year").notNull(),
  title: text("title").notNull(),
  client: text("client").notNull(),
  industry: text("industry").notNull(),
  duration: text("duration").notNull(),
  team: text("team").notNull(),
  summary: text("summary").notNull(),
  challenge: text("challenge").notNull(),
  approach: text("approach").notNull(),
  outcome: text("outcome").notNull(),
  metric: text("metric").notNull(),
  metricLabel: text("metric_label").notNull(),
  tags: text("tags").array().notNull(),
  featured: boolean("featured").default(false).notNull(),
  results: jsonb("results").$type<ProjectResult[]>().notNull(),
  deliverables: jsonb("deliverables").$type<ProjectDeliverable[]>().notNull(),
  screenshots: jsonb("screenshots").$type<ProjectScreenshot[]>().notNull(),
  testimonial: jsonb("testimonial").$type<ProjectTestimonial | null>(),
  nextSlug: text("next_slug"),
  classes: jsonb("classes").$type<ProjectClasses>().notNull(),
  published: boolean("published").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Project = typeof projects.$inferSelect;

// NEWSLETTER CAMPAIGNS

export const campaignStatusEnum = pgEnum("campaign_status", [
  "draft",
  "sending",
  "sent",
  "failed",
]);

export const campaignTypeEnum = pgEnum("campaign_type", [
  "announcement",
  "product-update",
  "tips-tricks",
  "blog-digest",
  "custom",
]);

export const newsletterCampaigns = pgTable("newsletter_campaigns", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  previewText: text("preview_text").notNull(),
  type: campaignTypeEnum("type").notNull(),
  status: campaignStatusEnum("status").notNull().default("draft"),
  body: jsonb("body").$type<EmailBlock[]>().notNull(),
  sentAt: timestamp("sent_at"),
  sentCount: integer("sent_count").default(0).notNull(),
  failedCount: integer("failed_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// BLOG POSTS

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  slug: text("slug").unique().notNull(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().notNull(),
  featured: boolean("featured").default(false).notNull(),
  publishedAt: timestamp("published_at").notNull(),
  readTime: text("read_time").notNull(),
  author: jsonb("author").$type<BlogAuthor>().notNull(),
  heroAlt: text("hero_alt").notNull(),
  heroSrc: text("hero_src"),
  toc: jsonb("toc").$type<TocEntry[]>().notNull(),
  body: jsonb("body").$type<ContentBlock[]>().notNull(),
  relatedSlugs: text("related_slugs").array().notNull(),
  classes: jsonb("classes").$type<BlogPostClasses>().notNull(),
  published: boolean("published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type BlogPost = typeof blogPosts.$inferSelect;
