import { PublicHero } from "@/components/public/PublicHero";
export function ContactHero() {
  return (
    <PublicHero
      eyebrow="Contact VeilCode"
      title={
        <>
          A good project starts
          <br />
          <em>with a conversation.</em>
        </>
      }
      description="Have a detailed brief or just the start of an idea? Tell us what you are working toward. We will come back to you within one business day."
    >
      <div className="public-actions">
        <a className="public-button" href="#form-message">
          Tell us about your project ↓
        </a>
        <a
          className="public-button public-button-secondary"
          href="mailto:support@veilcode.studio"
        >
          Send an email
        </a>
      </div>
    </PublicHero>
  );
}
