/**
 * How a build is framed on /work: a paid client engagement, one of our own
 * products, or a concept build for an industry we serve. Driven entirely by
 * the `client` column so the badge and the hero stats can never disagree.
 */
export type ProjectKind = "client" | "own" | "concept";

export const PROJECT_KIND_LABEL: Record<ProjectKind, string> = {
  client: "Client build",
  own: "Own product",
  concept: "Concept build",
};

export function getProjectKind(client: string | null | undefined): ProjectKind {
  const value = client?.trim().toLowerCase() ?? "";

  if (value === "concept build") return "concept";
  // Matches "VeilCode Studio (own product)" and the bare studio name still
  // present on some rows.
  if (value.startsWith("veilcode studio")) return "own";

  return "client";
}

export function getProjectKindLabel(client: string | null | undefined) {
  return PROJECT_KIND_LABEL[getProjectKind(client)];
}

/** Formats a set of project years as a range: ["2025","2026"] -> "2025-26". */
function formatYearRange(years: string[]) {
  const parsed = years
    .map((year) => Number(year?.match(/\d{4}/)?.[0]))
    .filter((year) => Number.isFinite(year));

  if (parsed.length === 0) return "--";

  const first = Math.min(...parsed);
  const last = Math.max(...parsed);

  if (first === last) return String(first);

  return `${first}\u2013${String(last).slice(2)}`;
}

export type WorkStat = { value: string; label: string };

/** Hero stats for /work, derived from the projects query rather than hardcoded. */
export function getWorkStats(
  projects: { client: string; year: string }[]
): WorkStat[] {
  // No projects (empty table, or the query failed) means no numbers to claim.
  if (projects.length === 0) return [];

  const clientBuilds = projects.filter(
    (project) => getProjectKind(project.client) === "client"
  ).length;

  return [
    { value: String(projects.length), label: "Builds you can inspect" },
    { value: String(clientBuilds), label: "For real businesses" },
    { value: formatYearRange(projects.map((project) => project.year)), label: "Build years" },
  ];
}
