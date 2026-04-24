# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server on localhost:3000
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

**Database (Drizzle + Neon PostgreSQL):**

```bash
npx drizzle-kit generate   # Generate migration files from schema changes
npx drizzle-kit migrate    # Apply tracked migrations to the database
npx drizzle-kit push       # Diff schema against live DB and apply directly (preferred for dev)
npx drizzle-kit studio     # Open Drizzle Studio (DB GUI)
```

## Environment Variables

Required in `.env`:

- `DATABASE_URL` — Neon PostgreSQL connection string
- `RESEND_API_KEY` — Resend email API key
- `FRONTEND_URL` — Public URL of the site (used for email confirmation links)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — Clerk publishable key
- `CLERK_SECRET_KEY` — Clerk secret key
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` — `/sign-in`
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` — `/sign-up`
- `ADMIN_EMAILS` — Comma-separated list of bootstrap admin emails (e.g. `franktamalejr@gmail.com`). First matching sign-in auto-inserts them into the `admins` table.
- `CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
- `CLOUDINARY_API_KEY` — Cloudinary API key
- `CLOUDINARY_API_SECRET` — Cloudinary API secret
- `CLOUDINARY_UPLOAD_FOLDER` — Optional, defaults to `veilcode`

## Architecture

This is the **VeilCode agency website** — a Next.js 16 App Router project with Tailwind CSS v4, Drizzle ORM, Neon PostgreSQL, Clerk auth, and Cloudinary image storage.

### Route Groups

- `app/(client)/` — Public-facing marketing site (wrapped in `Nav` + `Footer`)
- `app/(admin)/admin/` — Admin panel (protected by `requireAdmin()` in the `(admin)` layout; `/admin/*` URLs)
- `app/(auth)/sign-in` and `app/(auth)/sign-up` — Clerk catch-all routes (`[[...sign-in]]`, `[[...sign-up]]`)
- `app/privacy-policy/` — Standalone page

The root `app/layout.tsx` wraps the app in `<ClerkProvider>`, includes global fonts (Geist), Sonner toaster, Facebook Pixel script, and JSON-LD schema.

### Components

- `components/shared/` — Page-section components used across the (client) routes (Hero, Navbar, Footer, Services, Work, CTA, etc.)
- `components/extras/` — Smaller primitives and cards used by shared components
- `components/contact/` — Contact form logic (FormField, PillSelector, FormActions, types)
- `components/admin/` — Admin-panel primitives (`Sidebar`, `Header`, `PageHeader`, `ComingSoon`)
- `components/ui/` — shadcn/ui primitives (Button, Badge, Card, Input, Label, etc.)
- `components/icons/` — SVG icon components
- `components/variants/` — Alternate visual variants for shared components

### Data Layer

- `db/schema.ts` — Drizzle tables:
  - `newsletterSubscriptionTable`, `clientInquiries` (public forms)
  - `admins` (team access list)
  - `jobOpenings`, `services`, `projects`, `blogPosts` (CMS content)
  - Enums: `budget`, `timelines`, `services`, `goals`, `service_slug`
  - Nested content shapes (body blocks, classes, results, screenshots, etc.) live in `jsonb` columns typed via `$type<T>()` from `@/types/content` and `@/constants/blog`.
- `db/drizzle.ts` — Drizzle client instance (Neon serverless driver)
- All DB access goes through `@/db/drizzle` (the `db` export)
- `types/content.ts` — Shared JSONB type shapes (class bundles, etc.) mirroring the frontend constants

### API Routes

- `POST /api/newsletter` — Subscribe email; generates a token and sends confirmation email via Resend
- `GET /api/newsletter/confirm` — Validates token and marks subscription confirmed
- `POST /api/(clients)/messages` — Saves a client inquiry (`clientInquiries` table)
- `POST /api/admin/upload` — Admin-gated image upload to Cloudinary; `multipart/form-data` with `file` + optional `folder` suffix
- `DELETE /api/admin/upload?publicId=...` — Admin-gated Cloudinary asset deletion

### Auth (Clerk v6+)

- `proxy.ts` uses `clerkMiddleware` with `createRouteMatcher(['/admin(.*)'])` to require a signed-in session on any `/admin/*` route.
- `lib/auth/admin.ts` — `requireAdmin()` and `getAdminContext()`. Checks the signed-in user's primary email against the `admins` table, auto-inserts bootstrap emails listed in `ADMIN_EMAILS`.
- First admin: add `ADMIN_EMAILS=youremail@example.com` to `.env`, sign in via `/sign-in`, and the admin row is inserted automatically.
- Further teammates are added from `/admin/access` (email-only — they can sign up after being added, and on sign-in their Clerk `userId` is linked).

### Email

- `lib/resend.ts` — Resend client
- `lib/template.ts` — HTML email templates (newsletter confirmation, etc.)

### Image storage (Cloudinary)

- `lib/cloudinary.ts` — Cloudinary SDK instance (configured from env)
- Admin UIs upload via `POST /api/admin/upload` and store the returned `secure_url` in the corresponding DB field (e.g. `blog_posts.hero_src`, `projects.screenshots[].src`).

### Styling

Tailwind CSS v4 (via `@tailwindcss/postcss`). Utility helpers in `lib/utils.ts` (clsx + tailwind-merge). Animations via `framer-motion` and `tw-animate-css`. Theme tokens (brand, surface, service accents, ink scale) defined in `app/globals.css` under `@theme`.
