import { PublicHero } from "@/components/public/PublicHero";
export function CareersHero() {
  return (
    <PublicHero
      eyebrow="Careers"
      title={
        <>
          Care about the craft?
          <br />
          <em>So do we.</em>
        </>
      }
      description="Explore opportunities to build web platforms, mobile experiences and AI automation with VeilCode Studio in Kampala."
    />
  );
}
