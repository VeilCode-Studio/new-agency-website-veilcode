CREATE TYPE "public"."budget" AS ENUM('Under $1,500', '$1,500 – $5,000', '$5,000 – $15,000', '$15,000 – $30,000', '$30,000 - $60,000', '$60,000', 'Let''s Discuss');--> statement-breakpoint
CREATE TYPE "public"."goals" AS ENUM('Increase revenue', 'Reduce manual work', 'Launch a new product', 'Improve user experience', 'Scale existing systems', 'Enter a new market', 'Build internal tools', 'Data-driven decisions');--> statement-breakpoint
CREATE TYPE "public"."service_slug" AS ENUM('web', 'mobile', 'data', 'social', 'ai');--> statement-breakpoint
CREATE TYPE "public"."services" AS ENUM('Web Solutions (Design & Development)', 'Mobile Application Development', 'Data Analytics', 'Social Media Marketing', 'AI Automation', 'Multiple Services', 'Not Sure Yet');--> statement-breakpoint
CREATE TYPE "public"."timelines" AS ENUM('ASAP — urgent project', 'Within 1 month', '1–3 months', '3–6 months', 'Just exploring for now');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_user_id" text,
	"email" text NOT NULL,
	"name" text,
	"added_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_clerk_user_id_unique" UNIQUE("clerk_user_id"),
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"category" text NOT NULL,
	"tags" text[] NOT NULL,
	"published_at" timestamp NOT NULL,
	"read_time" text NOT NULL,
	"author" jsonb NOT NULL,
	"hero_alt" text NOT NULL,
	"hero_src" text,
	"toc" jsonb NOT NULL,
	"body" jsonb NOT NULL,
	"related_slugs" text[] NOT NULL,
	"classes" jsonb NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "client_inquiries" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"service" text NOT NULL,
	"company" text,
	"budget" "budget",
	"timelines" timelines,
	"message" text NOT NULL,
	"goals" "goals"[],
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "job_openings" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"department" text NOT NULL,
	"location" text NOT NULL,
	"type" text NOT NULL,
	"experience" text NOT NULL,
	"description" text NOT NULL,
	"responsibilities" text[] NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscription" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"subscribed" boolean DEFAULT false NOT NULL,
	"confirm_token" text,
	"confirm_token_expires_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "newsletter_subscription_email_unique" UNIQUE("email"),
	CONSTRAINT "newsletter_subscription_confirm_token_unique" UNIQUE("confirm_token")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"service" "service_slug" NOT NULL,
	"service_label" text NOT NULL,
	"year" text NOT NULL,
	"title" text NOT NULL,
	"client" text NOT NULL,
	"industry" text NOT NULL,
	"duration" text NOT NULL,
	"team" text NOT NULL,
	"summary" text NOT NULL,
	"challenge" text NOT NULL,
	"approach" text NOT NULL,
	"outcome" text NOT NULL,
	"metric" text NOT NULL,
	"metric_label" text NOT NULL,
	"tags" text[] NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"results" jsonb NOT NULL,
	"deliverables" jsonb NOT NULL,
	"screenshots" jsonb NOT NULL,
	"testimonial" jsonb,
	"next_slug" text,
	"classes" jsonb NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" text PRIMARY KEY NOT NULL,
	"number" text NOT NULL,
	"icon" text NOT NULL,
	"title" text NOT NULL,
	"tagline" text NOT NULL,
	"desc" text NOT NULL,
	"intro" text NOT NULL,
	"challenge" text NOT NULL,
	"approach" text NOT NULL,
	"bullets" text[] NOT NULL,
	"deliverables" jsonb NOT NULL,
	"stack" text[] NOT NULL,
	"tags" text[] NOT NULL,
	"metric" text NOT NULL,
	"metric_label" text NOT NULL,
	"metric_sub" text NOT NULL,
	"card_classes" jsonb NOT NULL,
	"overview_classes" jsonb NOT NULL,
	"deep_dive_classes" jsonb NOT NULL,
	"sort_order" integer NOT NULL,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
