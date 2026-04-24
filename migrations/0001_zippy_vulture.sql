CREATE TYPE "public"."campaign_status" AS ENUM('draft', 'sending', 'sent', 'failed');--> statement-breakpoint
CREATE TYPE "public"."campaign_type" AS ENUM('announcement', 'product-update', 'tips-tricks', 'blog-digest', 'custom');--> statement-breakpoint
CREATE TABLE "newsletter_campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"subject" text NOT NULL,
	"preview_text" text NOT NULL,
	"type" "campaign_type" NOT NULL,
	"status" "campaign_status" DEFAULT 'draft' NOT NULL,
	"body" jsonb NOT NULL,
	"sent_at" timestamp,
	"sent_count" integer DEFAULT 0 NOT NULL,
	"failed_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
