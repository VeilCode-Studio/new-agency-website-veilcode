import { buildPageMetadata } from "@/lib/seo/metadata";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
export const metadata = buildPageMetadata({
  title: "Newsletter link expired",
  description:
    "Newsletter link expired. Read the next steps for your VeilCode Studio newsletter subscription.",
  path: "/newsletter/expired",
});

export default function Outcome() {
  return (
    <div className="public-outcome">
      <div className="public-outcome-card">
        <div className="public-standalone-nav">
          <Link href="/">← VeilCode</Link>
          <ThemeToggle size="sm" />
        </div>
        <p className="public-eyebrow">Link expired</p>
        <h1>This link has expired.</h1>
        <p>
          Confirmation links are valid for 24 hours. Subscribe again and we will
          send a fresh confirmation link.
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
