import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Lock } from "lucide-react";

const HowWeUseInfo = () => {
  return (
    <Card className="bg-surface border-line mb-8">
      <CardHeader>
        <h2 className="flex items-center gap-3 text-2xl">
          <Lock className="w-6 h-6 text-brand" />
          <span className="text-ink">3. How We Use Your Information</span>
        </h2>
      </CardHeader>
      <CardContent className="text-ink-muted leading-relaxed space-y-4">
        <ul className="space-y-4">
          <li className="flex gap-4">
            <div className="w-6 h-6 rounded-2xl bg-brand-dim shrink-0 flex items-center justify-center text-brand text-sm font-mono">
              01
            </div>
            <div>
              To respond to your inquiries and deliver our services (web
              solutions, AI automation, data analytics, etc.)
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-6 h-6 rounded-2xl bg-brand-dim shrink-0 flex items-center justify-center text-brand text-sm font-mono">
              02
            </div>
            <div>
              To improve our website, services, and client experience through
              analytics
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-6 h-6 rounded-2xl bg-brand-dim shrink-0 flex items-center justify-center text-brand text-sm font-mono">
              03
            </div>
            <div>
              To send important updates, project communications, and (with
              consent) marketing about new capabilities
            </div>
          </li>
          <li className="flex gap-4">
            <div className="w-6 h-6 rounded-2xl bg-brand-dim shrink-0 flex items-center justify-center text-brand text-sm font-mono">
              04
            </div>
            <div>To comply with legal obligations and protect our rights</div>
          </li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default HowWeUseInfo;
