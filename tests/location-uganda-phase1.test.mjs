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

test("Uganda location has Phase 1 SEO and schema requirements", () => {
  assert.match(
    locationData,
    /metaTitle:\s*"Web Development & AI Automation Agency in Kampala \| VeilCode"/,
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

test("Uganda hero contains the required local trust signals", () => {
  assert.match(locationData, /Based in Kampala · Serving Uganda & East Africa/);
  assert.match(
    locationData,
    /Kampala's digital product agency for businesses built to grow/,
  );
  assert.match(locationData, /Kampala, Uganda/);
  assert.match(
    locationData,
    /5\+ Years in Kampala · 45\+ Projects Delivered · Mobile-First by Default/,
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
  assert.match(locationData, /prestige-properties/);
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
  assert.match(locationData, /EST overlap available/);
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
  assert.match(locationData, /typically 7-9 AM ET or 5-7 PM ET/);
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
