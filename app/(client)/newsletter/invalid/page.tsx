import { buildPageMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
export const metadata = buildPageMetadata({
  title: "Invalid newsletter link",
  description:
    "Invalid newsletter link. Read the next steps for your VeilCode Studio newsletter subscription.",
  path: "/newsletter/invalid",
});

export default function Outcome() {
  return (
    <div className="public-outcome">
      <div className="public-outcome-card">
        <div className="public-standalone-nav">
          <Link href="/">← VeilCode</Link>
          <ThemeToggle size="sm" />
        </div>
        <p className="public-eyebrow">Invalid link</p>
        <h1>This link isn’t valid.</h1>
        <p>
          The confirmation link is incomplete or does not exist. Try subscribing
          again to receive a fresh link.
        </p>
        <div className="public-actions">
          <Link className="public-button" href="/blog#newsletter">
            Subscribe again
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
