import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const locationData = readFileSync("constants/locations.ts", "utf8");
const page = readFileSync("app/(client)/locations/[country]/page.tsx", "utf8");
const hero = readFileSync(
  "app/(client)/locations/[country]/_components/LocationHero.tsx",
  "utf8",
);
const body = readFileSync(
  "app/(client)/locations/[country]/_components/LocationBody.tsx",
  "utf8",
);
const metadataHelper = readFileSync("lib/seo/metadata.ts", "utf8");

test("Uganda location has Phase 1 SEO and schema requirements", () => {
  assert.match(
    locationData,
    /metaTitle:\s*"Website Design & Development in Uganda \| VeilCode"/,
  );
  assert.match(
    locationData,
    /metaDescription:\s*"VeilCode is Kampala's digital product agency\. We build conversion-focused websites, mobile apps, and AI automation systems for Ugandan businesses ready to grow\."/,
  );
  assert.match(locationData, /ogImage:\s*"\/assets\/og\/uganda\.jpg"/);
  assert.match(page, /image:\s*market\.ogImage/);
  assert.match(page, /localBusinessJsonLd/);
  assert.match(locationData, /schemaType:\s*"LocalBusiness"/);
  assert.match(locationData, /addressLocality:\s*"Kampala"/);
  assert.match(locationData, /addressCountry:\s*"UG"/);
});

test("branded location metadata uses absolute titles to avoid duplicate VeilCode suffixes", () => {
  assert.match(page, /title:\s*market\.metaTitle/);
  // Branded titles are used as-is; everything else gets the suffix once.
  assert.match(metadataHelper, /titleIncludesBrand\(title\)\s*\?\s*title\s*:\s*`\$\{title\}\$\{TITLE_SUFFIX\}`/);
  assert.match(metadataHelper, /title:\s*\{\s*absolute:\s*fullTitle\s*\}/);
});

test("Uganda hero contains the required local trust signals", () => {
  assert.match(locationData, /Based in Kampala · Serving Uganda & East Africa/);
  assert.match(
    locationData,
    /Websites and apps for Ugandan businesses, with Mobile Money and WhatsApp built in/,
  );
  assert.match(locationData, /Kampala, Uganda/);
  assert.match(
    locationData,
    /Kampala-based · Meet in person · Mobile-first by default/,
  );
  assert.match(hero, /locationBadge/);
  assert.match(hero, /stats/);
});

test("Uganda body includes required sections without placeholder pricing", () => {
  assert.match(locationData, /Built for how Uganda does business/);
  assert.match(locationData, /Most business happens on mobile/);
  assert.match(locationData, /How we work with Ugandan clients/);
  assert.match(locationData, /Industries we serve in Uganda/);
  assert.match(locationData, /Work that performs/);
  assert.match(locationData, /Questions from Ugandan businesses/);
  assert.doesNotMatch(body, /Pricing context/);
});

test("Uganda content has internal service links, portfolio relevance, FAQs, and cross-market links", () => {
  assert.match(locationData, /\/services\/web-solutions/);
  assert.match(locationData, /\/services\/mobile-applications/);
  assert.match(locationData, /\/services\/ai-automation/);
  assert.match(locationData, /bienvenidos-apartments/);
  assert.match(locationData, /nexus-commerce/);
  assert.match(locationData, /vantage-ai-agents/);
  assert.match(locationData, /Are you actually based in Uganda/);
  assert.match(locationData, /remote discovery, design reviews, and full delivery/);
  assert.match(locationData, /Also serving clients in:/);
  assert.match(locationData, /\/locations\/united-states/);
  assert.match(locationData, /\/locations\/united-kingdom/);
  assert.match(locationData, /\/locations\/canada/);
  assert.match(locationData, /\/locations\/australia/);
  assert.match(body, /market\.crossMarketLinks/);
});

test("Australia location has Phase 5 SEO, schema, and offshore trust requirements", () => {
  assert.match(
    locationData,
    /metaTitle:\s*"Web, Mobile & AI Automation Agency for Australian Businesses \| VeilCode"/,
  );
  assert.match(
    locationData,
    /metaDescription:\s*"VeilCode helps Australian businesses ship web platforms, mobile apps, and automation systems with senior remote delivery, full IP ownership, and the process discipline offshore work often lacks\."/,
  );
  assert.match(locationData, /ogImage:\s*"\/assets\/og\/australia\.jpg"/);
  assert.match(locationData, /schemaType:\s*"ProfessionalService"/);
  assert.match(locationData, /areaServed:\s*"AU"/);
  assert.match(
    locationData,
    /Offshore development done right - for Australian businesses that have been burned before/,
  );
  assert.match(locationData, /Start with a Discovery Sprint/);
  assert.match(locationData, /Full IP ownership/);
  assert.match(locationData, /What goes wrong with offshore development/);
  assert.match(locationData, /timezone black hole/);
  assert.match(locationData, /Start small\. Trust what you see\./);
  assert.match(locationData, /Timezone management - honest and practical/);
  assert.match(locationData, /5-8 hour offset/);
  assert.match(locationData, /Agency project work vs\. offshore hiring/);
  assert.match(locationData, /Not a direct hire arrangement/);
  assert.match(locationData, /Pascua v Doessel/);
  assert.match(locationData, /Book a Discovery Sprint/);
  assert.match(page, /areaServed:\s*market\.areaServed/);
  assert.match(body, /market\.detailSections/);
  assert.match(body, /market\.serviceCards/);
});

test("United States location has Phase 2 SEO, schema, and remote trust requirements", () => {
  assert.match(
    locationData,
    /metaTitle:\s*"Remote Web, Mobile & AI Automation Agency for US Companies \| VeilCode"/,
  );
  assert.match(
    locationData,
    /metaDescription:\s*"VeilCode partners with US founders and operators who need senior web, mobile, and AI automation delivery without the cost of a large domestic agency\. Remote-first, outcome-driven\."/,
  );
  assert.match(locationData, /ogImage:\s*"\/assets\/og\/united-states\.jpg"/);
  assert.match(locationData, /schemaType:\s*"ProfessionalService"/);
  assert.match(locationData, /areaServed:\s*"US"/);
  assert.match(locationData, /Remote delivery for US teams/);
  assert.match(locationData, /Eastern Time overlap available/);
  assert.match(
    locationData,
    /Senior product engineering for US founders who need to move fast/,
  );
  assert.match(locationData, /Book a Discovery Call/);
  assert.match(locationData, /NDA-ready/);
  assert.match(locationData, /Milestone billing/);
  assert.match(locationData, /IP ownership included/);
});

test("United States location includes the requested Phase 2 content sections", () => {
  assert.match(locationData, /Best fit for US teams/);
  assert.match(locationData, /Early-stage founders/);
  assert.match(locationData, /Operators scaling ops/);
  assert.match(locationData, /Agencies with overflow/);
  assert.match(locationData, /The remote concerns - addressed directly/);
  assert.match(locationData, /8 to 11 AM Eastern \(3 to 6 PM in Kampala\)/);
  assert.match(locationData, /during US daylight saving time, or 4 to 7 PM in Kampala during US standard time/);
  assert.match(locationData, /Next\.js, React Native, TypeScript, Supabase/);
  assert.match(locationData, /What working with us looks like/);
  assert.match(locationData, /Discovery \(Week 1\)/);
  assert.match(locationData, /QA & Launch \(Week 8-9\)/);
  assert.match(locationData, /What US teams hire us for/);
  assert.match(locationData, /What US clients ask before they hire us/);
});

test("United States location has US-specific FAQs, services, CTAs, and cross-market links", () => {
  assert.match(locationData, /You're based in Uganda - why would we hire you over a US agency/);
  assert.match(locationData, /Do you sign NDAs/);
  assert.match(locationData, /Who owns the code/);
  assert.match(locationData, /HubSpot, Stripe, Twilio, Intercom, Zapier, Airtable, Notion/);
  assert.match(locationData, /Most US engagements run between \$5,000 and \$30,000/);
  assert.match(locationData, /Book a no-commitment discovery call\./);
  assert.match(locationData, /30 minutes\. You explain the goal\./);
  assert.match(locationData, /Book a Call/);
  assert.match(locationData, /\/services\/ai-automation/);
  assert.match(locationData, /\/work/);
  assert.match(locationData, /Also serving:/);
  assert.match(locationData, /\/locations\/uganda/);
  assert.match(locationData, /\/locations\/united-kingdom/);
  assert.match(locationData, /\/locations\/canada/);
  assert.match(locationData, /\/locations\/australia/);
});

test("Canada location has Phase 3 SEO, schema, and documentation trust requirements", () => {
  assert.match(
    locationData,
    /metaTitle:\s*"Web, Mobile & AI Automation Agency for Canadian Companies \| VeilCode"/,
  );
  assert.match(
    locationData,
    /metaDescription:\s*"VeilCode helps Canadian businesses build web platforms, mobile apps, and AI automation systems with senior remote delivery, clear documentation, and practical scope control\."/,
  );
  assert.match(locationData, /ogImage:\s*"\/assets\/og\/canada\.jpg"/);
  assert.match(locationData, /schemaType:\s*"ProfessionalService"/);
  assert.match(locationData, /areaServed:\s*"CA"/);
  assert.match(locationData, /Remote delivery for Canadian teams/);
  assert.match(locationData, /Eastern & Pacific overlap available/);
  assert.match(
    locationData,
    /Senior digital product delivery for Canadian businesses that need focused execution/,
  );
  assert.match(locationData, /Full IP ownership/);
  assert.match(locationData, /Written scopes/);
  assert.match(locationData, /Bilingual-capable builds/);
  assert.match(locationData, /Documented handover/);
});

test("Canada location includes the requested Phase 3 content sections", () => {
  assert.match(locationData, /What we optimise for in the Canadian market/);
  assert.match(locationData, /Documentation is not optional/);
  assert.match(locationData, /Bilingual capability when you need it/);
  assert.match(locationData, /Scope control over open-ended retainers/);
  assert.match(locationData, /Working across Canadian timezones/);
  assert.match(locationData, /Our afternoon overlaps with Eastern mornings/);
  assert.match(locationData, /Pacific clients get early calls/);
  assert.match(locationData, /How we work with Canadian clients/);
  assert.match(locationData, /Written scope and cost estimate/);
  assert.match(locationData, /Post-launch support window/);
  assert.match(locationData, /What Canadian teams hire us for/);
});

test("Canada location has Canadian FAQs, services, CTA, and cross-market links", () => {
  assert.match(locationData, /You're based in Uganda - why should a Canadian business work with you/);
  assert.match(locationData, /Can you build bilingual \(English and French\) websites/);
  assert.match(locationData, /What does documentation look like at handover/);
  assert.match(locationData, /What payment methods do you accept from Canadian clients/);
  assert.match(locationData, /CAD invoicing/);
  assert.match(locationData, /Clear scope\. Clean delivery\. No surprises\./);
  assert.match(locationData, /Get a Project Scope/);
  assert.match(locationData, /web development agency Canada/);
  assert.match(locationData, /digital agency for Canadian startups/);
  assert.match(locationData, /remote software agency Canada/);
  assert.match(locationData, /Toronto, Vancouver, and Montreal/);
  assert.match(locationData, /\/locations\/uganda/);
  assert.match(locationData, /\/locations\/united-states/);
  assert.match(locationData, /\/locations\/united-kingdom/);
  assert.match(locationData, /\/locations\/australia/);
});

test("United Kingdom location has Phase 4 SEO, schema, and UK trust requirements", () => {
  assert.match(
    locationData,
    /metaTitle:\s*"Digital Product Agency for UK Businesses \| Web, Mobile & AI \| VeilCode"/,
  );
  assert.match(
    locationData,
    /metaDescription:\s*"VeilCode builds web platforms, mobile apps, and AI automation systems for UK SMEs and growth-stage businesses\. GDPR-aware delivery, accessibility-conscious builds, documented delivery\."/,
  );
  assert.match(locationData, /ogImage:\s*"\/assets\/og\/united-kingdom\.jpg"/);
  assert.match(locationData, /schemaType:\s*"ProfessionalService"/);
  assert.match(locationData, /areaServed:\s*"GB"/);
  assert.match(locationData, /Remote delivery for UK teams/);
  assert.match(locationData, /Remote delivery for UK teams · 2 hours ahead of the UK in summer, 3 in winter/);
  assert.match(
    locationData,
    /Web, mobile and AI systems for UK businesses with measurable growth targets/,
  );
  assert.match(locationData, /GDPR-aware builds/);
  assert.match(locationData, /Accessible by default/);
  assert.match(locationData, /ROI-focused delivery/);
  assert.match(locationData, /2 hours ahead of the UK in summer, 3 in winter/);
});

test("United Kingdom location includes the requested Phase 4 content sections", () => {
  assert.match(locationData, /What we optimise for in the UK market/);
  assert.match(locationData, /Digital credibility that closes deals/);
  assert.match(locationData, /Compliance is not optional/);
  assert.match(locationData, /ROI over aesthetics/);
  assert.match(locationData, /2 hours ahead of the UK in summer, 3 in winter/);
  assert.match(locationData, /only 2 hours ahead of UK time/);
  assert.match(locationData, /How delivery works for UK clients/);
  assert.match(locationData, /Accessibility and GDPR-conscious builds included by default/);
  assert.match(locationData, /Analytics and conversion tracking set up at launch/);
  assert.match(locationData, /What UK teams hire us for/);
  assert.match(locationData, /Sectors we work with in the UK/);
});

test("United Kingdom location has UK FAQs, services, CTA, and cross-market links", () => {
  assert.match(locationData, /You're based in Uganda - is that a problem for a UK business/);
  assert.match(locationData, /Do you build GDPR-compliant websites/);
  assert.match(locationData, /Do you build to WCAG accessibility standards/);
  assert.match(locationData, /Can you work alongside our existing UK marketing or product team/);
  assert.match(locationData, /Tell us what needs to perform better\./);
  assert.match(locationData, /Start the conversation/);
  assert.match(locationData, /digital agency for UK businesses/);
  assert.match(locationData, /web development agency UK/);
  assert.match(locationData, /AI automation UK SME/);
  assert.match(locationData, /\/blog/);
  assert.match(locationData, /\/services\/web-solutions/);
  assert.match(locationData, /\/locations\/uganda/);
  assert.match(locationData, /\/locations\/united-states/);
  assert.match(locationData, /\/locations\/canada/);
  assert.match(locationData, /\/locations\/australia/);
});
