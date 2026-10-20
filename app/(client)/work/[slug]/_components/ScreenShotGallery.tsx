import { publicImageSource } from "@/lib/public-image";
import Image from "next/image";
import { SectionTag, AccentLine } from "@/components/extras/Primitives";
import { ScreenshotPlaceholder } from "./CaseStudyHero";

function Shot({
  shot,
  accent,
  dimBg,
  border,
  variant = "standard",
}: {
  shot: ProjectScreenshot;
  accent: string;
  dimBg: string;
  border: string;
  variant?: "standard" | "phone";
}) {
  if (shot.src) {
    if (variant === "phone") {
      return (
        <figure className="mx-auto w-full max-w-70">
          <div
            className={`relative rounded-[1.75rem] border ${border}
              bg-page p-2 shadow-[0_18px_54px_rgba(0,0,0,0.22)]`}
          >
            <div className="pointer-events-none absolute left-1/2 top-3 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-line" />
            <div className="relative aspect-[9/19.5] overflow-hidden rounded-[1.25rem] bg-surface-hi">
              <Image
                src={publicImageSource(shot.src)}
                alt={shot.alt || shot.caption || "Project screenshot"}
                title={shot.caption || shot.alt || "Project screenshot"}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 70vw, (max-width: 1024px) 30vw, 280px"
                className="object-contain"
              />
            </div>
          </div>
          <figcaption className="mt-2.5 font-sans text-xs text-ink-faint text-center">
            {shot.caption}
          </figcaption>
        </figure>
      );
    }

    return (
      <figure className="w-full">
        <div className="relative w-full overflow-hidden rounded-xl border border-line bg-surface-hi aspect-[16/10] max-w-5xl mx-auto">
          <Image
            src={publicImageSource(shot.src)}
            alt={shot.alt || shot.caption || "Project screenshot"}
            title={shot.caption || shot.alt || "Project screenshot"}
            fill
            loading="lazy"
            sizes="(max-width: 768px) calc(100vw - 40px), (max-width: 1200px) 50vw, 1024px"
            className="object-contain"
          />
        </div>
        <figcaption className="mt-2.5 font-sans text-xs text-ink-faint text-center">
          {shot.caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <ScreenshotPlaceholder
      alt={shot.alt || shot.caption || "Project screenshot"}
      caption={shot.caption}
      accent={accent}
      dimBg={dimBg}
      border={border}
    />
  );
}

// screenshot gallery

export function ScreenshotGallery({ project: p }: { project: Project }) {
  const { classes: c } = p;
  const isMobileApp = p.service === "mobile";

  // Skip hero shot (index 0) — already rendered in CaseStudyHero
  const shots = p.screenshots.slice(1);
  if (shots.length === 0) return null;

  // Group consecutive "half" shots into pairs; wide shots stand alone
  type Group =
    | { type: "wide"; shot: ProjectScreenshot }
    | { type: "pair"; shots: [ProjectScreenshot, ProjectScreenshot] };

  const groups: Group[] = [];
  let i = 0;
  while (i < shots.length) {
    if (
      shots[i].size === "half" &&
      i + 1 < shots.length &&
      shots[i + 1].size === "half"
    ) {
      groups.push({ type: "pair", shots: [shots[i], shots[i + 1]] });
      i += 2;
    } else {
      groups.push({ type: "wide", shot: shots[i] });
      i += 1;
    }
  }

  return (
    <section className="py-24 px-6 md:px-10 bg-surface border-y border-line">
      <div className="max-w-300 mx-auto">
        <div>
          {/* Header */}
          <div>
            <SectionTag>Project Screenshots</SectionTag>
            <AccentLine />
          </div>

          {/* Gallery */}
          {isMobileApp ? (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {shots.map((shot, i) => (
                <div key={`${shot.caption}-${i}`}>
                  <Shot
                    shot={shot}
                    accent={c.accent}
                    dimBg={c.dimBg}
                    border={c.border}
                    variant="phone"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {groups.map((group, gi) =>
                group.type === "wide" ? (
                  <div key={gi}>
                    <Shot
                      shot={group.shot}
                      accent={c.accent}
                      dimBg={c.dimBg}
                      border={c.border}
                    />
                  </div>
                ) : (
                  <div
                    key={gi}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-5xl mx-auto"
                  >
                    {group.shots.map((shot, si) => (
                      <Shot
                        key={si}
                        shot={shot}
                        accent={c.accent}
                        dimBg={c.dimBg}
                        border={c.border}
                      />
                    ))}
                  </div>
                ),
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
