import { PublicHero, ProjectActions } from "@/components/public/PublicHero";
import type { WorkStat } from "@/lib/projects/kind";
export function WorkHero({ stats }: { stats: WorkStat[] }) {
  return (
    <PublicHero
      eyebrow="Our work"
      title={
        <>
          Real problems.
          <br />
          <em>Thoughtful products.</em>
        </>
      }
      description="Client work, our own products, and concept builds for the industries we serve. Each one shows how we would approach your project. Ask for a walkthrough of any build."
      aside={
        stats.length ? (
          <dl className="public-stats-panel">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        ) : undefined
      }
    >
      <ProjectActions
        secondaryHref={stats.length ? "#portfolio" : "/contact"}
        secondaryLabel={
          stats.length ? "Browse the projects" : "Contact the studio"
        }
      />
    </PublicHero>
  );
}
