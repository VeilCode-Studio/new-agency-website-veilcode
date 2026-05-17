import test from "node:test";
import assert from "node:assert/strict";
import { parseProjectJsonForForm } from "./importJson.ts";

const validPayload = {
  slug: "kampala-healthcare-portal",
  service: "web",
  serviceLabel: "Web Solutions",
  year: "2026",
  title: "Kampala Healthcare Portal",
  client: "Kampala Health Group",
  industry: "Healthcare",
  duration: "8 weeks",
  team: "2 engineers, 1 designer",
  summary: "A patient intake and appointment platform for a growing clinic network.",
  challenge: "Manual bookings created duplicated records and long wait times.",
  approach: "We built a responsive portal with guided intake and admin workflows.",
  outcome: "The team reduced booking admin time and improved appointment visibility.",
  metric: "-42%",
  metricLabel: "Admin handling time",
  tags: ["Next.js", "Healthcare", "Admin Portal"],
  featured: true,
  published: false,
  sortOrder: 3,
  results: [
    {
      metric: "-42%",
      label: "Admin handling time",
      sub: "within the first month",
    },
  ],
  deliverables: [
    {
      title: "Patient intake flow",
      desc: "Structured forms for triage and appointment requests.",
    },
  ],
  screenshots: [
    {
      src: null,
      alt: "Healthcare portal dashboard",
      caption: "Operations dashboard",
      size: "wide",
    },
  ],
  testimonial: {
    quote: "The portal gave our front desk a cleaner operating rhythm.",
    name: "Miriam Akello",
    role: "Operations Lead",
    initials: "MA",
  },
  nextSlug: null,
  classes: {
    accent: "text-svc-web",
    dimBg: "bg-svc-web-dim",
    border: "border-svc-web-border",
    hoverBorder: "hover:border-svc-web-border",
    hoverShadow: "hover:shadow-[0_0_32px_var(--color-svc-web-border)]",
    gradFrom: "from-svc-web-dim",
  },
};

test("parseProjectJsonForForm returns form data for a valid project JSON payload", () => {
  const result = parseProjectJsonForForm(JSON.stringify(validPayload));

  assert.equal(result.ok, true);
  if (!result.ok) return;

  assert.equal(result.data.slug, "kampala-healthcare-portal");
  assert.equal(result.data.service, "web");
  assert.equal(result.data.nextSlug, "");
  assert.deepEqual(result.data.tags, ["Next.js", "Healthcare", "Admin Portal"]);
  assert.equal(result.data.results[0].metric, "-42%");
});

test("parseProjectJsonForForm reports malformed JSON without throwing", () => {
  const result = parseProjectJsonForForm("{not-json");

  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.equal(result.error, "Import file is not valid JSON.");
});

test("parseProjectJsonForForm reports schema validation errors", () => {
  const result = parseProjectJsonForForm(JSON.stringify({ ...validPayload, title: "" }));

  assert.equal(result.ok, false);
  if (result.ok) return;

  assert.equal(result.error, "Title is required");
});
