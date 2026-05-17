import type { ProjectClasses } from "../../types/content";
import { formatProjectValidationError, projectInputSchema } from "./validation.ts";

type ServiceSlug = "web" | "mobile" | "data" | "social" | "ai";

export type ImportedProjectFormData = {
  slug: string;
  service: ServiceSlug;
  serviceLabel: string;
  year: string;
  title: string;
  client: string;
  industry: string;
  duration: string;
  team: string;
  summary: string;
  challenge: string;
  approach: string;
  outcome: string;
  metric: string;
  metricLabel: string;
  tags: string[];
  featured: boolean;
  published: boolean;
  sortOrder: number;
  results: ProjectResult[];
  deliverables: ProjectDeliverable[];
  screenshots: ProjectScreenshot[];
  testimonial: ProjectTestimonial | null;
  nextSlug: string;
  classes: ProjectClasses;
};

export type ProjectJsonImportResult =
  | { ok: true; data: ImportedProjectFormData }
  | { ok: false; error: string };

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("Import file is not valid JSON.");
  }
}

export function parseProjectJsonForForm(raw: string): ProjectJsonImportResult {
  const trimmed = raw.trim();
  if (!trimmed) return { ok: false, error: "Paste JSON or choose a JSON file first." };

  let parsed: unknown;
  try {
    parsed = parseJson(trimmed);
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Import file is not valid JSON.",
    };
  }

  const validated = projectInputSchema.safeParse(parsed);
  if (!validated.success) {
    return { ok: false, error: formatProjectValidationError(validated.error) };
  }

  const project = validated.data;

  return {
    ok: true,
    data: {
      ...project,
      nextSlug: project.nextSlug ?? "",
    },
  };
}
