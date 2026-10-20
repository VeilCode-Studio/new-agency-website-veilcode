import { ProjectActions } from "@/components/public/PublicHero";
export function CTA() {
  return (
    <section className="px-6 md:px-10 py-20">
      <div className="max-w-300 mx-auto public-closing">
        <p className="public-eyebrow">Have something in mind?</p>
        <h2>Let’s make the next step a useful one.</h2>
        <p>
          Tell us what needs to work better. We will help shape the scope, the
          approach and a practical path to launch.
        </p>
        <ProjectActions
          secondaryHref="/contact"
          secondaryLabel="Contact the studio"
        />
      </div>
    </section>
  );
}
