
import { TechBadge } from "../extras/TechBadge";

/* ─── DATA ────────────────────────────────────────────────────────────────── */

const STACK = [
  "Next.js", "React", "TypeScript", "React Native", "Expo",
  "Python",  "Node.js", "PostgreSQL", "OpenAI", "LangChain",
  "Tailwind CSS", "Framer Motion", "Vercel", "AWS", "dbt",
  "Power BI", "Figma", "n8n",
] as const;


export function TechStack() {

  return (
    <section className="py-20 px-6 md:px-10 border-y border-line">
      <div className="max-w-300 mx-auto">
        <div
        >
          <p
            className="font-mono text-[11px] tracking-[0.14em] uppercase
              text-ink-faint text-center mb-10"
          >
            Our Technology Stack
          </p>

          <div
            className="flex flex-wrap justify-center gap-3"
          >
            {STACK.map((label) => (
              <TechBadge key={label} label={label} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}