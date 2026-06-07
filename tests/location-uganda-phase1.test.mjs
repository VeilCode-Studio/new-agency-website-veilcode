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
