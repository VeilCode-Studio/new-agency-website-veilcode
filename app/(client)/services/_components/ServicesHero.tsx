import {
  PublicHero,
  ProjectActions,
  BuildPreview,
} from "@/components/public/PublicHero";
export function ServicesHero() {
  return (
    <PublicHero
      eyebrow="Our services"
      title={
        <>
          The right build for
          <br />
          <em>your next chapter.</em>
        </>
      }
      description="Web platforms, mobile applications and AI automation. Three connected practices, shaped around the problem your business needs to solve."
      aside={<BuildPreview />}
    >
      <ProjectActions
        secondaryHref="#services-overview"
        secondaryLabel="Explore services"
      />
    </PublicHero>
  );
}
