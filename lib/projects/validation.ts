import { z } from "zod";

const trimmedString = z.string().trim();

const serviceSlugSchema = z.union([
  z.literal("web"),
  z.literal("mobile"),
  z.literal("data"),
  z.literal("social"),
  z.literal("ai"),
]);

const projectClassesSchema = z.object({
  accent: trimmedString.min(1, "Accent class is required"),
  dimBg: trimmedString.min(1, "Dim background class is required"),
  border: trimmedString.min(1, "Border class is required"),
  hoverBorder: trimmedString.min(1, "Hover border class is required"),
  hoverShadow: trimmedString.min(1, "Hover shadow class is required"),
  gradFrom: trimmedString.min(1, "Gradient class is required"),
});

const resultSchema = z.object({
  metric: trimmedString.min(1, "Result metric is required"),
  label: trimmedString.min(1, "Result label is required"),
  sub: trimmedString.min(1, "Result sub-text is required"),
});

const deliverableSchema = z.object({
  title: trimmedString.min(1, "Deliverable title is required"),
  desc: trimmedString.min(1, "Deliverable description is required"),
});

const screenshotSchema = z.object({
  src: z.string().trim().nullable(),
  alt: z.string().trim(),
  caption: z.string().trim(),
  size: z.union([z.literal("wide"), z.literal("half")]),
});

const testimonialSchema = z.object({
  quote: trimmedString.min(1, "Testimonial quote is required"),
  name: trimmedString.min(1, "Testimonial name is required"),
  role: trimmedString.min(1, "Testimonial role is required"),
  initials: trimmedString.min(1, "Testimonial initials are required"),
});

export const projectInputSchema = z.object({
  slug: trimmedString.min(1, "Slug is required"),
  service: serviceSlugSchema,
  serviceLabel: trimmedString.min(1, "Service label is required"),
  year: trimmedString.min(1, "Year is required"),
  title: trimmedString.min(1, "Title is required"),
  client: trimmedString.min(1, "Client is required"),
  industry: trimmedString.min(1, "Industry is required"),
  duration: trimmedString.min(1, "Duration is required"),
  team: trimmedString.min(1, "Team is required"),
  summary: trimmedString.min(1, "Summary is required"),
  challenge: trimmedString.min(1, "Challenge is required"),
  approach: trimmedString.min(1, "Approach is required"),
  outcome: trimmedString.min(1, "Outcome is required"),
  metric: trimmedString.min(1, "Metric is required"),
  metricLabel: trimmedString.min(1, "Metric label is required"),
  tags: z.array(trimmedString.min(1)).default([]),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  sortOrder: z.coerce.number().int().default(0),
  results: z.array(resultSchema).default([]),
  deliverables: z.array(deliverableSchema).default([]),
  screenshots: z.array(screenshotSchema).default([]),
  testimonial: testimonialSchema.nullable().default(null),
  nextSlug: z.string().trim().nullable().optional(),
  classes: projectClassesSchema,
});

export function formatProjectValidationError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Invalid project data";
}
