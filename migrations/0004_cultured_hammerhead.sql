ALTER TABLE "services" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "seo_title" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "meta_description" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "h1" text;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "supporting_capabilities" text[] DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "faqs" jsonb DEFAULT '[]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD COLUMN "seo_enabled" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "services" ADD CONSTRAINT "services_slug_unique" UNIQUE("slug");--> statement-breakpoint
UPDATE "services"
SET
  "slug" = 'web-solutions',
  "seo_title" = 'Web Solutions Agency | VeilCode',
  "meta_description" = 'VeilCode designs and develops high-performance websites and web applications for businesses that need speed, clarity, and measurable growth.',
  "h1" = 'Web solutions for ambitious businesses',
  "supporting_capabilities" = ARRAY['Technical SEO', 'API integrations', 'Performance optimization', 'Analytics and reporting', 'Backend systems'],
  "faqs" = '[{"question":"What types of web projects do you build?","answer":"We build marketing websites, landing pages, web applications, customer portals, dashboards, and custom platforms for teams that need reliable digital infrastructure."},{"question":"Can you improve an existing website instead of rebuilding it?","answer":"Yes. We can audit the current site, fix performance or conversion issues, and recommend whether optimization or a rebuild is the better investment."},{"question":"Do web projects include analytics and SEO basics?","answer":"Yes. We include technical SEO foundations, performance checks, and analytics setup when they are part of the project scope."}]'::jsonb,
  "seo_enabled" = true
WHERE "id" = 'web';--> statement-breakpoint
UPDATE "services"
SET
  "slug" = 'mobile-applications',
  "seo_title" = 'Mobile Application Development Agency | VeilCode',
  "meta_description" = 'VeilCode builds iOS and Android mobile applications with React Native, Expo, backend integrations, and practical launch support.',
  "h1" = 'Mobile applications built for real users and real operations',
  "supporting_capabilities" = ARRAY['API integrations', 'Push notifications', 'Offline-aware UX', 'App Store deployment', 'Usage analytics'],
  "faqs" = '[{"question":"Do you build both iOS and Android apps?","answer":"Yes. Our default mobile stack is React Native and Expo, which lets us deliver polished iOS and Android apps from one maintainable codebase."},{"question":"Can you connect the app to our existing backend?","answer":"Yes. We can integrate with your existing APIs, databases, authentication system, payment provider, and internal tools."},{"question":"Do you help with app store launch?","answer":"Yes. We can support app metadata, screenshots, build submission, review responses, and post-launch updates."}]'::jsonb,
  "seo_enabled" = true
WHERE "id" = 'mobile';--> statement-breakpoint
UPDATE "services"
SET
  "slug" = 'ai-automation',
  "seo_title" = 'AI Automation Agency | VeilCode',
  "meta_description" = 'VeilCode builds AI automation systems, workflow tools, internal copilots, and reporting layers that reduce manual work and improve operational visibility.',
  "h1" = 'AI automation systems for teams ready to reduce manual work',
  "supporting_capabilities" = ARRAY['Workflow mapping', 'LLM integrations', 'CRM automation', 'Document processing', 'Reporting dashboards'],
  "faqs" = '[{"question":"What business processes can you automate?","answer":"We usually start with repetitive, high-volume workflows such as lead qualification, document processing, reporting, follow-ups, approvals, and support triage."},{"question":"Do AI automations need human review?","answer":"Some do. We design workflows with human approval steps where accuracy, compliance, or brand risk requires oversight."},{"question":"Can automation connect to our current tools?","answer":"Yes. We can connect CRMs, forms, email, WhatsApp workflows, databases, dashboards, and third-party APIs depending on the project scope."}]'::jsonb,
  "seo_enabled" = true
WHERE "id" = 'ai';
