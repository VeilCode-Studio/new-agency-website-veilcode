CREATE TABLE IF NOT EXISTS "app_settings" (
  "key" text PRIMARY KEY NOT NULL,
  "value" text NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint

INSERT INTO "app_settings" ("key", "value")
VALUES ('chatbot_enabled', 'true')
ON CONFLICT ("key") DO NOTHING;
