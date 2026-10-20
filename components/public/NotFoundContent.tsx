import Link from "next/link";
import { PublicShell } from "@/components/public/PublicShell";
export function NotFoundContent() {
  return (
    <PublicShell>
      <div className="public-outcome">
        <div className="public-outcome-card">
          <p className="public-eyebrow">404 · Page not found</p>
          <h1>Let’s get you back on track.</h1>
          <p>
            This page may have moved, or the link may be incomplete. Find out
            what we build, explore our work or contact the studio.
          </p>
          <div className="public-actions">
            <Link className="public-button" href="/">
              Back to homepage
            </Link>
            <Link
              className="public-button public-button-secondary"
              href="/services"
            >
              Explore services
            </Link>
            <Link
              className="public-button public-button-secondary"
              href="/contact"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </PublicShell>
  );
}
