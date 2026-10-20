import React from "react";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Database } from "lucide-react";

const InfoCollected = () => {
  return (
    <Card className="bg-surface border-line mb-8">
      <CardHeader>
        <h2 className="flex items-center gap-3 text-2xl">
          <Database className="w-6 h-6 text-brand" />
          <span className="text-ink">2. Information We Collect</span>
        </h2>
      </CardHeader>
      <CardContent className="text-ink-muted leading-relaxed space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-medium text-ink mb-3">
              Information You Provide
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-brand mt-px">•</span> Contact details
                (name, email, phone, company)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand mt-px">•</span> Project briefs and
                requirements
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand mt-px">•</span> Inquiries via forms
                or email
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand mt-px">•</span> Payment and billing
                information (processed securely via third parties)
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-ink mb-3">
              Automatically Collected Information
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-brand mt-px">•</span> IP address, browser
                type, device information
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand mt-px">•</span> Usage data (pages
                visited, time spent)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand mt-px">•</span> Cookies and similar
                tracking technologies
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand mt-px">•</span> Analytics data from
                tools like Google Analytics
              </li>
            </ul>
          </div>
        </div>
        <Separator className="bg-line" />
        <p className="text-xs text-ink-faint italic">
          We never collect sensitive personal data (race, religion, health)
          unless explicitly required for a project and with your prior written
          consent.
        </p>
      </CardContent>
    </Card>
  );
};

export default InfoCollected;
