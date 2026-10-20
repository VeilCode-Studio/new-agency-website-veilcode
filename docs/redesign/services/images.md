# Service images and CMS replacements

Implemented October 21, 2026. Scope: the web, mobile and AI service-detail heroes, plus the service CMS fields needed to replace their images. Existing copy, metadata, routes, query policies, authentication and theme switching remain intact. No new application dependencies.

## Generated assets

The built-in image generator created three separate, matching illustrations. No project OpenAI API key was read or used. Original PNGs remain in the generator's local output directory; the production assets are optimized WebP files in this repository.

| Service page | Production asset | Dimensions | File size |
| --- | --- | --- | --- |
| `/services/web-solutions` | `public/images/services/web-development.webp` | 1536 × 1024 | 89,666 bytes |
| `/services/mobile-applications` | `public/images/services/mobile-app-development.webp` | 1536 × 1024 | 90,690 bytes |
| `/services/ai-automation` | `public/images/services/ai-automation.webp` | 1536 × 1024 | 72,432 bytes |

The exact prompts are recorded in [service-image-prompts.json](../../service-image-prompts.json). Warm linen, lavender, peach and mint keep the three illustrations consistent with the existing themes. These are illustrative mockups, without fabricated client logos or performance claims.

## Implementation

- `lib/service-images.ts` owns service defaults and image metadata. The three known service IDs receive their generated default when no CMS override exists. Other services keep the existing HTML hero preview until an image is uploaded.
- The existing service hero remains a Server Component. `next/image` supplies responsive sources and sizes, width/height and a reserved 3:2 frame. Only the hero image is preloaded. No client image-fetching code, animation dependency or new query was added.
- Replacement images use the existing authenticated `/api/admin/upload` Cloudinary endpoint, under the `services` folder. Public delivery reuses `publicImageSource` to bound Cloudinary originals before Next.js optimization. Images must be JPEG, PNG, WebP or AVIF and at most 10 MB in the uploader.
- The optional nullable `hero_src`, `hero_alt` and `hero_title` columns store CMS overrides. API validation accepts supported raster images from Cloudinary or the local service-image directory, requires alt text for replacements and limits field lengths. Omitting all three fields preserves existing image values for older clients; clearing the source clears the override.
- Uploading disables service saving. Upload failure preserves the selected image. Uploaded files are not deleted automatically when an editor cancels or restores a default, avoiding deletion of an asset another page might use.

## Editing images

Open **Admin → Services → Edit**, or create a service. The **Service hero image** section previews the generated default. Upload a replacement, describe the actual image in **Image alt text**, optionally edit **Image title**, and save the service. For the three core services, **Restore generated default** clears the replacement after saving. This does not change the page's SEO title or H1.

## Database migration

`0006_service_hero_images.sql` adds three nullable text columns. It was tested on a temporary branch cloned from the configured database: all three existing service rows, their copy and timestamps were preserved, and image values could be written and read. The temporary branch was given a one-hour expiry and a small compute that suspends after five minutes.

The configured database already had the legacy schema but an empty Drizzle migration ledger. `node scripts/migrate-service-images.mjs` uses the standard Drizzle migrator with only migration 0006, avoiding replay of old table-creation migrations. It uses a direct connection and records the migration hash. This scoped migration was applied successfully to the configured database; before/after comparison verified that all existing service data and timestamps remained unchanged. Default images are code-defined, so no service-row content was seeded or replaced.

For another existing installation with the same legacy schema and migration history, run that scoped command before deploying this code. Installations with a normal, complete migration history can use their standard migration workflow. The script is repeatable when migration 0006 is already recorded.

## Verification

- Production build: passed, including TypeScript and 41 static pages.
- Automated suite: 59 passing tests, including default selection, URL/alt validation, omitted-field compatibility, replacement/removal payloads, authorization and write-failure behavior.
- Targeted ESLint: passed on all changed application files.
- Browser checks: all three service pages at 390 px and 1440 px in light, linen, dark and midnight themes (24 cases). Correct service-specific images, responsive sources, alt/title attributes, reserved proportions, approved H1s, no horizontal overflow and no browser errors.
- Six WCAG A/AA hero audits passed with no violations. All three hero images were present in pages rendered with JavaScript disabled. Desktop and mobile linen screenshots were visually reviewed.
- Isolated browser checks exercised the actual create/edit service form with mocked framework navigation and mocked network writes: default selection, upload/pending state, blocked saving during upload, required alt text, replacement payload, failed-upload preservation, restoring the default and unsupported-file rejection. Approved titles and H1s remained unchanged in save payloads.

The CMS checks did not make a real Cloudinary upload or authenticated browser save; they reuse the existing authenticated upload endpoint and test new behavior without mutating published content. No fresh Lighthouse score or field Core Web Vitals claim is made.

An initial production-build attempt was rejected because automatic approval review reached an account usage limit. After the stated reset time, the same escalated build was approved and completed successfully.
