import {
  PublicHero,
  ProjectActions,
  BuildPreview,
} from "@/components/public/PublicHero";
export function AboutHeroSection() {
  return (
    <PublicHero
      eyebrow="About VeilCode"
      title={
        <>
          A small studio.
          <br />
          <em>A direct connection.</em>
        </>
      }
      description="VeilCode Studio is a founder-led product studio in Kampala. You work directly with the engineer building your product."
      aside={<BuildPreview />}
    >
      <ProjectActions secondaryHref="#story" secondaryLabel="Meet the studio" />
    </PublicHero>
  );
}
