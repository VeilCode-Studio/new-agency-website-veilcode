import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users } from "lucide-react";

const InfoSharingAndDisclosure = () => {
  return (
    <Card className="bg-surface border-line mb-8">
      <CardHeader>
        <h2 className="flex items-center gap-3 text-2xl">
          <Users className="w-6 h-6 text-brand" />
          <span className="text-ink">4. Sharing &amp; Disclosure</span>
        </h2>
      </CardHeader>
      <CardContent className="text-ink-muted leading-relaxed">
        <p>
          We do not sell your personal information. We may share data only in
          these limited cases:
        </p>
        <ul className="mt-6 space-y-3 text-sm">
          <li className="flex items-start gap-3">
            <span className="text-brand">↗</span> With trusted service providers
            (Vercel, AWS, Stripe, analytics tools) under strict data-processing
            agreements
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand">↗</span> When required by law or to
            protect VeilCode and our clients
          </li>
          <li className="flex items-start gap-3">
            <span className="text-brand">↗</span> In the event of a business
            transfer (merger, acquisition) with appropriate safeguards
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default InfoSharingAndDisclosure;
