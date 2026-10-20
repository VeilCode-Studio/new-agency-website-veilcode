import { PublicHero } from "@/components/public/PublicHero";
export function BlogHero({
  stats,
}: {
  stats: {
    articlesPublished: number;
    disciplinesCovered: number;
    readingMinutes: number;
  };
}) {
  return (
    <PublicHero
      eyebrow="The VeilCode blog"
      title={
        <>
          Ideas worth
          <br />
          <em>building on.</em>
        </>
      }
      description="Engineering deep dives, design thinking, and practical AI written by Frank Tamale, founder of VeilCode Studio."
      aside={
        <dl className="public-stats-panel">
          <div>
            <dt>Articles published</dt>
            <dd>{stats.articlesPublished}</dd>
          </div>
          <div>
            <dt>Disciplines covered</dt>
            <dd>{stats.disciplinesCovered}</dd>
          </div>
          <div>
            <dt>Minutes of reading</dt>
            <dd>{stats.readingMinutes}</dd>
          </div>
        </dl>
      }
    >
      <div className="public-actions">
        <a className="public-button" href="#articles">
          Find your next read ↓
        </a>
        <a className="public-button public-button-secondary" href="#newsletter">
          Join the newsletter
        </a>
      </div>
    </PublicHero>
  );
}
