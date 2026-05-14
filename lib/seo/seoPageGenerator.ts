import type { SeoFaq } from "@/types/content";
import { LOCATION_MARKETS, type LocationMarket } from "@/constants/locations";

export type SeoPageGeneratorServiceId = "web" | "mobile" | "ai";

export type SeoPageGeneratorSelection = {
  marketSlugs: string[];
  serviceIds: SeoPageGeneratorServiceId[];
  includeLocationPages: boolean;
  includeServiceLocationPages: boolean;
  publishMode: "draft" | "live";
};

export type SeoPageGeneratorRecord = {
  slug: string;
  pageType: "location" | "service-location";
  countryCode: string | null;
  countryName: string | null;
  serviceId: SeoPageGeneratorServiceId | null;
  title: string;
  metaDescription: string;
  h1: string;
  heroCopy: string;
  bodyText: string;
  faqs: SeoFaq[];
  ctaLabel: string;
  ctaHref: string;
  relatedServiceIds: string[];
  relatedProjectSlugs: string[];
  relatedBlogSlugs: string[];
  published: boolean;
  indexable: boolean;
};

type ServiceConfig = {
  title: string;
  h1: string;
  heroCopy: string;
  slugSuffix: (market: LocationMarket) => string;
  bodyLead: string;
  faq: [string, string][];
};

const COUNTRY_CODES: Record<string, string> = {
  uganda: "UG",
  "united-states": "US",
  "united-kingdom": "GB",
  canada: "CA",
  australia: "AU",
};

const DEFAULT_RELATED_PROJECTS = [
  "prestige-properties-real-estate-platform",
  "reachflow-lead-tracking-crm",
];

const DEFAULT_RELATED_BLOGS = ["building-fast-web-apps-for-low-bandwidth-markets"];

const SERVICE_CONFIG: Record<SeoPageGeneratorServiceId, ServiceConfig> = {
  web: {
    title: "Web Solutions Agency",
    h1: "Web solutions that make {country} businesses faster to launch and easier to trust",
    heroCopy:
      "We build fast, maintainable websites and web apps for teams that need senior execution, clear scopes, and measurable outcomes.",
    slugSuffix: (market) => (market.shortName === "USA" ? "web-development-agency" : market.shortName === "Uganda" ? "web-solutions" : "web-solutions-agency"),
    bodyLead:
      "Web work usually starts when a business needs a better first impression, faster delivery, or a site that can support actual lead generation.",
    faq: [
      ["Can you rebuild an existing site?", "Yes. We can improve the current site or rebuild it when the structure is no longer serving the business."],
      ["Do you support SEO-friendly builds?", "Yes. We build with clear structure, metadata control, and search intent in mind from the start."],
    ],
  },
  mobile: {
    title: "Mobile App Development Agency",
    h1: "Mobile apps for {country} teams that need reliable product delivery",
    heroCopy:
      "We design and build mobile products that are practical to launch, easy to maintain, and shaped around real user behavior.",
    slugSuffix: () => "mobile-app-development",
    bodyLead:
      "Mobile projects are a fit when users need a focused app experience instead of another browser tab and a spreadsheet workflow.",
    faq: [
      ["Can you build cross-platform apps?", "Yes. We can scope React Native delivery when one codebase is the right tradeoff."],
      ["Do you help with app launch?", "Yes. We can support rollout planning, app store readiness, and post-launch iteration."],
    ],
  },
  ai: {
    title: "AI Automation Agency",
    h1: "AI automation that removes repetitive work for {country} teams",
    heroCopy:
      "We connect AI to real workflows so your team spends less time on manual follow-up, reporting, triage, and repeat admin.",
    slugSuffix: () => "ai-automation",
    bodyLead:
      "AI projects are most useful when they remove work from a repeatable process instead of adding a fragile demo layer.",
    faq: [
      ["Can you automate internal workflows?", "Yes. We can wire forms, reporting, support, and approval flows into practical automation."],
      ["Do you build safe AI workflows?", "Yes. We focus on scoped automation with human review where the business needs control."],
    ],
  },
};

function getCountryCode(market: LocationMarket) {
  return COUNTRY_CODES[market.slug] ?? null;
}

function getCountryDisplayName(market: LocationMarket) {
  return market.countryName === "United States" ? "the United States" : market.countryName;
}

function getMarketPrefix(market: LocationMarket) {
  return market.shortName.toLowerCase();
}

function titleCase(value: string) {
  if (value === "ai") return "AI";
  return value
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function buildLocationSlug(market: LocationMarket) {
  return `${getMarketPrefix(market)}-digital-product-agency`;
}

function buildServiceSlug(market: LocationMarket, serviceId: SeoPageGeneratorServiceId) {
  return `${getMarketPrefix(market)}-${SERVICE_CONFIG[serviceId].slugSuffix(market)}`;
}

function buildServiceTitle(market: LocationMarket, serviceId: SeoPageGeneratorServiceId) {
  const country = getCountryDisplayName(market);
  const service = SERVICE_CONFIG[serviceId];

  if (serviceId === "web" && market.shortName === "USA") {
    return `Web Development Agency in ${country} | VeilCode`;
  }

  return `${service.title} in ${country} | VeilCode`;
}

function buildServiceH1(market: LocationMarket, serviceId: SeoPageGeneratorServiceId) {
  const country = getCountryDisplayName(market);
  const service = SERVICE_CONFIG[serviceId];

  return service.h1.replace("{country}", country);
}

function buildServiceHeroCopy(market: LocationMarket, serviceId: SeoPageGeneratorServiceId) {
  const service = SERVICE_CONFIG[serviceId];
  const focus = market.serviceFocus.map(titleCase).join(", ");
  const country = getCountryDisplayName(market);

  return `${service.heroCopy} In ${country}, we keep the delivery practical and align the work with the market's strongest service focus: ${focus}.`;
}

function buildLocationBodyText(market: LocationMarket) {
  return [
    `## Why this page exists`,
    `${market.heroCopy} We scope the work around local trust signals, mobile use, and practical conversion paths.`,
    `## What matters in ${market.countryName}`,
    market.painPoints.join(" "),
    `## How we deliver`,
    `${market.deliveryNotes.join(" ")} ${market.pricingContext}`,
  ].join("\n\n");
}

function buildServiceBodyText(market: LocationMarket, serviceId: SeoPageGeneratorServiceId) {
  const service = SERVICE_CONFIG[serviceId];
  const country = getCountryDisplayName(market);

  return [
    `## Why this page exists`,
    `${service.bodyLead} In ${country}, we shape the delivery around the market's practical buying patterns and the way teams actually work.`,
    `## What we help with`,
    `${market.countryName} teams usually need clearer conversion paths, less manual work, and a delivery model that does not add unnecessary overhead.`,
    `## How we approach it`,
    `${market.deliveryNotes.join(" ")} ${market.pricingContext}`,
  ].join("\n\n");
}

function buildLocationFaqs(market: LocationMarket): SeoFaq[] {
  return market.faqs.slice(0, 3);
}

function buildServiceFaqs(market: LocationMarket, serviceId: SeoPageGeneratorServiceId): SeoFaq[] {
  const service = SERVICE_CONFIG[serviceId];
  return service.faq.map(([question, answer]) => ({
    question: question.replace("{country}", market.countryName),
    answer: answer.replace("{country}", market.countryName),
  }));
}

function buildRelatedServiceIds(market: LocationMarket, serviceId?: SeoPageGeneratorServiceId) {
  const ids = new Set<string>(market.serviceFocus);
  if (serviceId) ids.add(serviceId);
  return Array.from(ids);
}

function buildLocationPage(market: LocationMarket): SeoPageGeneratorRecord {
  return {
    slug: buildLocationSlug(market),
    pageType: "location",
    countryCode: getCountryCode(market),
    countryName: market.countryName,
    serviceId: null,
    title: market.metaTitle,
    metaDescription: market.metaDescription,
    h1: market.h1,
    heroCopy: market.heroCopy,
    bodyText: buildLocationBodyText(market),
    faqs: buildLocationFaqs(market),
    ctaLabel: market.ctaLabel,
    ctaHref: "/start",
    relatedServiceIds: buildRelatedServiceIds(market),
    relatedProjectSlugs: DEFAULT_RELATED_PROJECTS,
    relatedBlogSlugs: DEFAULT_RELATED_BLOGS,
    published: false,
    indexable: true,
  };
}

function buildServicePage(market: LocationMarket, serviceId: SeoPageGeneratorServiceId): SeoPageGeneratorRecord {
  return {
    slug: buildServiceSlug(market, serviceId),
    pageType: "service-location",
    countryCode: getCountryCode(market),
    countryName: market.countryName,
    serviceId,
    title: buildServiceTitle(market, serviceId),
    metaDescription:
      `${SERVICE_CONFIG[serviceId].title} for ${market.countryName} businesses that need a practical, senior delivery partner.`,
    h1: buildServiceH1(market, serviceId),
    heroCopy: buildServiceHeroCopy(market, serviceId),
    bodyText: buildServiceBodyText(market, serviceId),
    faqs: buildServiceFaqs(market, serviceId),
    ctaLabel: market.ctaLabel,
    ctaHref: "/start",
    relatedServiceIds: buildRelatedServiceIds(market, serviceId),
    relatedProjectSlugs: DEFAULT_RELATED_PROJECTS,
    relatedBlogSlugs: DEFAULT_RELATED_BLOGS,
    published: false,
    indexable: true,
  };
}

export function buildSeoPageGeneratorPages(selection: SeoPageGeneratorSelection) {
  const markets = LOCATION_MARKETS.filter((market) => selection.marketSlugs.includes(market.slug));
  const pages: SeoPageGeneratorRecord[] = [];

  for (const market of markets) {
    if (selection.includeLocationPages) {
      pages.push(buildLocationPage(market));
    }

    if (selection.includeServiceLocationPages) {
      for (const serviceId of selection.serviceIds) {
        pages.push(buildServicePage(market, serviceId));
      }
    }
  }

  return {
    pages,
    publishMode: selection.publishMode,
  };
}

export const SEO_SERVICE_OPTIONS: { value: SeoPageGeneratorServiceId; label: string; description: string }[] = [
  {
    value: "web",
    label: "Web",
    description: "Web solutions, redesigns, and conversion-focused builds.",
  },
  {
    value: "mobile",
    label: "Mobile",
    description: "Cross-platform app work and mobile product delivery.",
  },
  {
    value: "ai",
    label: "AI",
    description: "Automation, workflows, and systems that reduce manual work.",
  },
];
