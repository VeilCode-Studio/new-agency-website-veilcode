import { z } from "zod";

const trimmedString = z.string().trim();
const optionalString = z.string().trim().optional();

const authorSchema = z.object({
  name: trimmedString.min(1, "Author name is required"),
  role: trimmedString.min(1, "Author role is required"),
  initials: trimmedString,
  bio: z.string(),
  linkedin: z.string(),
  twitter: z.string(),
  accent: trimmedString.min(1),
  dimBg: trimmedString.min(1),
  border: trimmedString.min(1),
});

const classesSchema = z.object({
  accent: trimmedString.min(1),
  dimBg: trimmedString.min(1),
  border: trimmedString.min(1),
});

const tocSchema = z.object({
  id: trimmedString.min(1),
  level: z.union([z.literal(2), z.literal(3)]),
  text: trimmedString.min(1),
});

const chartValueSchema = z.union([z.string(), z.number()]);
const chartRowSchema = z.record(z.string(), chartValueSchema);

const h2Schema = z.object({
  type: z.literal("h2"),
  id: trimmedString.min(1, "Heading id is required"),
  text: trimmedString.min(1, "Heading text is required"),
});

const h3Schema = z.object({
  type: z.literal("h3"),
  id: trimmedString.min(1, "Heading id is required"),
  text: trimmedString.min(1, "Heading text is required"),
});

const paragraphSchema = z.object({
  type: z.literal("p"),
  html: trimmedString.min(1, "Paragraph content is required"),
});

const unorderedListSchema = z.object({
  type: z.literal("ul"),
  items: z.array(trimmedString.min(1)).min(1, "List needs at least one item"),
});

const orderedListSchema = z.object({
  type: z.literal("ol"),
  items: z.array(trimmedString.min(1)).min(1, "List needs at least one item"),
});

const codeSchema = z.object({
  type: z.literal("code"),
  lang: trimmedString.min(1, "Code language is required"),
  code: z.string().min(1, "Code content is required"),
});

const calloutSchema = z.object({
  type: z.literal("callout"),
  variant: z.union([z.literal("info"), z.literal("warning"), z.literal("tip")]),
  html: trimmedString.min(1, "Callout content is required"),
});

const statGridSchema = z.object({
  type: z.literal("stat-grid"),
  title: optionalString,
  description: optionalString,
  items: z
    .array(
      z.object({
        label: trimmedString.min(1, "Stat label is required"),
        value: trimmedString.min(1, "Stat value is required"),
        helper: optionalString,
      }),
    )
    .min(1, "Stat grid needs at least one item"),
});

const chartSchema = z
  .object({
    type: z.literal("chart"),
    chartType: z.union([z.literal("bar"), z.literal("line"), z.literal("donut")]),
    title: trimmedString.min(1, "Chart title is required"),
    description: optionalString,
    xKey: trimmedString.min(1, "Chart X key is required"),
    series: z
      .array(
        z.object({
          key: trimmedString.min(1, "Series key is required"),
          label: trimmedString.min(1, "Series label is required"),
          color: optionalString,
        }),
      )
      .min(1, "Chart needs at least one series"),
    data: z.array(chartRowSchema).min(1, "Chart needs at least one data row"),
    caption: optionalString,
    source: optionalString,
  })
  .superRefine((block, ctx) => {
    block.data.forEach((row, rowIndex) => {
      if (!(block.xKey in row)) {
        ctx.addIssue({
          code: "custom",
          path: ["data", rowIndex, block.xKey],
          message: `Row ${rowIndex + 1} is missing X key "${block.xKey}"`,
        });
      }

      block.series.forEach((series) => {
        const value = row[series.key];
        if (value === undefined) {
          ctx.addIssue({
            code: "custom",
            path: ["data", rowIndex, series.key],
            message: `Row ${rowIndex + 1} is missing series key "${series.key}"`,
          });
          return;
        }

        const numeric =
          typeof value === "number"
            ? Number.isFinite(value)
            : Number.isFinite(Number(value.replace(/,/g, "")));

        if (!numeric) {
          ctx.addIssue({
            code: "custom",
            path: ["data", rowIndex, series.key],
            message: `Row ${rowIndex + 1} series "${series.key}" must be numeric`,
          });
        }
      });
    });
  });

const dividerSchema = z.object({
  type: z.literal("divider"),
});

const contentBlockSchema = z.discriminatedUnion("type", [
  h2Schema,
  h3Schema,
  paragraphSchema,
  unorderedListSchema,
  orderedListSchema,
  codeSchema,
  calloutSchema,
  statGridSchema,
  chartSchema,
  dividerSchema,
]);

export const blogPostInputSchema = z.object({
  slug: trimmedString.min(1, "Slug is required"),
  title: trimmedString.min(1, "Title is required"),
  excerpt: trimmedString.min(1, "Excerpt is required"),
  category: trimmedString.min(1, "Category is required"),
  tags: z.array(trimmedString.min(1)),
  featured: z.boolean(),
  publishedAt: z.coerce.date(),
  readTime: trimmedString.min(1, "Read time is required"),
  author: authorSchema,
  heroAlt: z.string(),
  heroSrc: z.string().nullable(),
  toc: z.array(tocSchema),
  body: z.array(contentBlockSchema),
  relatedSlugs: z.array(trimmedString.min(1)),
  classes: classesSchema,
  published: z.boolean(),
});

export function formatBlogValidationError(error: z.ZodError) {
  return error.issues[0]?.message ?? "Invalid blog post data";
}
