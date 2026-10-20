import { buildPageMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
export const metadata = buildPageMetadata({
  title: "Newsletter subscription confirmed",
  description:
    "Newsletter subscription confirmed. Read the next steps for your VeilCode Studio newsletter subscription.",
  path: "/newsletter/confirmed",
});

export default function Outcome() {
  return (
    <div className="public-outcome">
      <div className="public-outcome-card">
        <div className="public-standalone-nav">
          <Link href="/">← VeilCode</Link>
          <ThemeToggle size="sm" />
        </div>
        <p className="public-eyebrow">Subscription confirmed</p>
        <h1>You’re on the list.</h1>
        <p>
          Your email address has been confirmed. Look out for engineering,
          design and practical AI notes from VeilCode Studio.
        </p>
        <div className="public-actions">
          <Link className="public-button" href="/blog">
            Read the blog
          </Link>
          <Link className="public-button public-button-secondary" href="/">
            Back to homepage
          </Link>
        </div>
        <p>
          Need help?{" "}
          <a className="underline" href="mailto:support@veilcode.studio">
            Contact us
          </a>
          .
        </p>
      </div>
    </div>
  );
}
