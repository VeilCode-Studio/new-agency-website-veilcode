import type { SeoFaq } from "@/types/content";

export type LocationMarket = {
  slug: string;
  countryName: string;
  shortName: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  heroCopy: string;
  painPoints: string[];
  deliveryNotes: string[];
  pricingContext: string;
  industries: string[];
  serviceFocus: string[];
  faqs: SeoFaq[];
  ctaLabel: string;
  ctaCopy: string;
};

export const LOCATION_MARKETS: LocationMarket[] = [
  {
    slug: "uganda",
    countryName: "Uganda",
    shortName: "Uganda",
    metaTitle: "Digital Product Agency in Uganda | VeilCode",
    metaDescription:
      "VeilCode is a Uganda-based digital product agency building web solutions, mobile applications, and AI automation for ambitious local and regional businesses.",
    eyebrow: "Built from Kampala",
    h1: "Digital product strategy and engineering for Ugandan businesses",
    heroCopy:
      "We help Ugandan teams modernize websites, launch mobile products, and automate operational work with systems designed for local constraints and regional growth.",
    painPoints: [
      "Businesses need credible digital channels that convert trust into inquiries and sales.",
      "Teams often rely on manual reporting, disconnected spreadsheets, and slow follow-up loops.",
      "Products must perform well on mixed devices, mobile-first traffic, and inconsistent network conditions.",
    ],
    deliveryNotes: [
      "Kampala-based collaboration with in-person discovery available when useful.",
      "Support for mobile money, local payment flows, WhatsApp-led operations, and low-bandwidth UX.",
      "Builds can be structured for Uganda-first launch with regional expansion paths.",
    ],
    pricingContext:
      "We scope projects around local business realities while keeping the engineering standard suitable for global markets.",
    industries: ["Real estate", "Healthcare", "Education", "Retail", "Professional services"],
    serviceFocus: ["web", "mobile", "ai"],
    faqs: [
      {
        question: "Do you only work with companies in Kampala?",
        answer:
          "No. We work with businesses across Uganda and can run remote discovery, design reviews, and delivery for teams outside Kampala.",
      },
      {
        question: "Can you build for mobile-first Ugandan customers?",
        answer:
          "Yes. We design around mobile traffic, performance, accessibility, WhatsApp workflows, and payment patterns common in Uganda.",
      },
      {
        question: "Can you support a Ugandan launch and later global expansion?",
        answer:
          "Yes. We can start with a Uganda-focused product and structure the codebase, analytics, and content model for future markets.",
      },
    ],
    ctaLabel: "Start a Uganda project",
    ctaCopy: "Bring us the business goal. We will help map the product, scope, and launch path.",
  },
  {
    slug: "united-states",
    countryName: "United States",
    shortName: "USA",
    metaTitle: "Web, Mobile, and AI Automation Agency for US Companies | VeilCode",
    metaDescription:
      "VeilCode helps US companies design and build high-performance web platforms, mobile apps, and AI automation systems with a remote-first delivery model.",
    eyebrow: "Remote delivery for US teams",
    h1: "Product engineering for US companies that need speed and senior execution",
    heroCopy:
      "We partner with US founders and operators who need lean, senior delivery for websites, customer portals, mobile products, internal tools, and AI-powered workflows.",
    painPoints: [
      "Growth teams need fast launches without adding long-term engineering overhead.",
      "Operations teams need automation that connects CRMs, forms, email, reporting, and support workflows.",
      "Marketing sites and web apps must be fast, measurable, and credible in competitive search markets.",
    ],
    deliveryNotes: [
      "Async-first delivery with planned overlap for Eastern and Central time collaboration.",
      "Clear written scopes, milestone reviews, and handover documentation for distributed teams.",
      "Built-in analytics, performance checks, and conversion-focused iteration paths.",
    ],
    pricingContext:
      "US clients usually engage us when they want senior product execution without the cost structure of a large domestic agency.",
    industries: ["SaaS", "E-commerce", "Real estate", "Healthcare", "Professional services"],
    serviceFocus: ["web", "mobile", "ai"],
    faqs: [
      {
        question: "Can you work with US time zones?",
        answer:
          "Yes. We work asynchronously by default and schedule reliable overlap windows for discovery, reviews, and launch coordination.",
      },
      {
        question: "Do you sign NDAs or vendor agreements?",
        answer:
          "Yes. We can review reasonable NDAs, vendor onboarding requirements, and project agreements before work begins.",
      },
      {
        question: "Can you integrate with US SaaS tools?",
        answer:
          "Yes. We commonly connect CRMs, payment systems, analytics tools, email platforms, automation tools, and custom APIs.",
      },
    ],
    ctaLabel: "Plan a US project",
    ctaCopy: "Tell us what needs to launch, improve, or automate. We will respond with a practical next step.",
  },
  {
    slug: "united-kingdom",
    countryName: "United Kingdom",
    shortName: "UK",
    metaTitle: "Digital Product Agency for UK Businesses | VeilCode",
    metaDescription:
      "VeilCode builds web solutions, mobile applications, and AI automation systems for UK businesses that need senior remote product delivery.",
    eyebrow: "Product delivery for UK teams",
    h1: "Web, mobile, and AI systems for UK businesses with practical growth goals",
    heroCopy:
      "We help UK SMEs, agencies, and growth-stage teams ship polished digital products, modernize customer journeys, and reduce repetitive operations through automation.",
    painPoints: [
      "Service businesses need stronger digital credibility and clearer conversion journeys.",
      "Teams need systems that reduce manual admin without disrupting existing operations.",
      "Digital products must meet high expectations for usability, accessibility, privacy, and performance.",
    ],
    deliveryNotes: [
      "Reliable overlap with UK working hours for discovery, demos, and launch reviews.",
      "Structured delivery documents that make stakeholder review and sign-off easier.",
      "Attention to accessibility, consent patterns, analytics, and practical maintainability.",
    ],
    pricingContext:
      "UK clients usually come to us for senior execution, clear scope control, and high quality delivery without bloated agency overhead.",
    industries: ["Professional services", "Property", "Education", "Healthcare", "B2B services"],
    serviceFocus: ["web", "mobile", "ai"],
    faqs: [
      {
        question: "Can you collaborate with our UK marketing or product team?",
        answer:
          "Yes. We can work as the delivery partner for your internal team or alongside an existing agency partner.",
      },
      {
        question: "Do you support accessibility and privacy-conscious builds?",
        answer:
          "Yes. We build with semantic markup, performance, consent-aware analytics, and maintainable content structures in mind.",
      },
      {
        question: "Can you take over an existing website or app?",
        answer:
          "Yes. We can audit the current stack, stabilize it, and then plan improvements or rebuilds where that is more practical.",
      },
    ],
    ctaLabel: "Discuss a UK project",
    ctaCopy: "Share the project context and we will help clarify the best delivery path.",
  },
  {
    slug: "canada",
    countryName: "Canada",
    shortName: "Canada",
    metaTitle: "Web, Mobile, and AI Automation Agency for Canadian Companies | VeilCode",
    metaDescription:
      "VeilCode works with Canadian companies on web platforms, mobile apps, and AI automation systems designed for remote collaboration and measurable outcomes.",
    eyebrow: "Remote product delivery for Canada",
    h1: "Senior digital product delivery for Canadian teams",
    heroCopy:
      "We support Canadian businesses that need focused engineering support for web experiences, mobile apps, dashboards, internal tools, and automation workflows.",
    painPoints: [
      "Teams need dependable delivery partners who can document decisions and work across distance.",
      "Customer-facing platforms must be fast, trustworthy, and easy to update after launch.",
      "Operational work often sits across disconnected tools, making reporting and follow-up slower than necessary.",
    ],
    deliveryNotes: [
      "Async delivery with planned overlap for Eastern time and flexible review windows.",
      "Documentation-first handover so internal teams can maintain the product confidently.",
      "Analytics and reporting included where measurement is part of the business case.",
    ],
    pricingContext:
      "Canadian clients can use us for focused senior delivery when hiring a full internal product team is not the right step yet.",
    industries: ["SaaS", "Healthcare", "Education", "Retail", "B2B services"],
    serviceFocus: ["web", "mobile", "ai"],
    faqs: [
      {
        question: "Can you support Canadian startups and SMEs remotely?",
        answer:
          "Yes. Our delivery model is remote-first and works well for teams that value clear documentation and scheduled review points.",
      },
      {
        question: "Can you build bilingual websites?",
        answer:
          "We can structure products for multilingual content. French copy and localization should be reviewed by native or specialist translators.",
      },
      {
        question: "Can you help automate internal reporting?",
        answer:
          "Yes. Reporting, dashboards, and workflow visibility are treated as supporting capabilities inside web, mobile, and AI automation projects.",
      },
    ],
    ctaLabel: "Plan a Canada project",
    ctaCopy: "Send the current challenge and we will outline a practical project route.",
  },
  {
    slug: "australia",
    countryName: "Australia",
    shortName: "Australia",
    metaTitle: "Digital Product Agency for Australian Businesses | VeilCode",
    metaDescription:
      "VeilCode helps Australian businesses build web solutions, mobile applications, and AI automation systems through clear remote delivery.",
    eyebrow: "Remote delivery for Australia",
    h1: "Web, mobile, and automation systems for Australian businesses",
    heroCopy:
      "We help Australian teams improve customer journeys, launch digital products, and reduce repetitive work with well-scoped remote engineering engagements.",
    painPoints: [
      "Businesses need digital products that work across mobile-heavy customer journeys.",
      "Teams want automation that saves time without creating fragile black-box systems.",
      "Remote delivery needs clear documentation, timezone-aware communication, and disciplined review cycles.",
    ],
    deliveryNotes: [
      "Async-first collaboration with clear written updates for timezone distance.",
      "Review calls scheduled around practical overlap windows when real-time discussion is needed.",
      "Every build includes handover notes so teams are not locked into unclear systems.",
    ],
    pricingContext:
      "Australian clients usually benefit from our remote model when they need senior execution and predictable scope without local agency overhead.",
    industries: ["Property", "Retail", "Professional services", "Education", "Health and wellness"],
    serviceFocus: ["web", "mobile", "ai"],
    faqs: [
      {
        question: "How do you handle the timezone difference with Australia?",
        answer:
          "We rely on strong async updates and schedule live sessions for discovery, demos, and decision points when overlap is available.",
      },
      {
        question: "Can you build mobile-first customer experiences?",
        answer:
          "Yes. Mobile-first web and React Native app delivery are core parts of our service model.",
      },
      {
        question: "Will we own the code and documentation?",
        answer:
          "Yes. Final deliverables include source code, implementation notes, and handover documentation based on the project scope.",
      },
    ],
    ctaLabel: "Start an Australia project",
    ctaCopy: "Share what you are trying to improve and we will help map the next useful step.",
  },
];

export function getLocationMarket(slug: string) {
  return LOCATION_MARKETS.find((market) => market.slug === slug) ?? null;
}
