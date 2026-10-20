import type { SeoFaq } from "@/types/content";

export type LocationMarket = {
  slug: string;
  countryName: string;
  shortName: string;
  metaTitle: string;
  metaDescription: string;
  ogImage?: string;
  schemaType?: "LocalBusiness" | "ProfessionalService";
  areaServed?: string | string[];
  addressLocality?: string;
  addressCountry?: string;
  eyebrow: string;
  locationBadge?: string;
  h1: string;
  heroCopy: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  statLine?: string;
  stats?: string[];
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  whyTitle?: string;
  painPoints: Array<string | { title: string; body: string }>;
  deliveryTitle?: string;
  deliveryNotes: string[];
  pricingContext: string;
  detailSections?: Array<{ title: string; body: string; ctaLabel?: string; ctaHref?: string }>;
  detailTitle?: string;
  industriesTitle?: string;
  industries: Array<string | { title: string; desc: string; href?: string }>;
  servicesTitle?: string;
  serviceCards?: Array<{ title: string; desc: string; href: string; accentClass?: string }>;
  serviceFocus: string[];
  portfolioTitle?: string;
  portfolioItems?: Array<{ slug: string; relevanceNote: string }>;
  portfolioCta?: string;
  faqTitle?: string;
  faqs: SeoFaq[];
  ctaLabel: string;
  ctaCopy: string;
  ctaBody?: string;
  crossMarketLabel?: string;
  crossMarketLinks?: Array<{ label: string; href: string }>;
};

export const LOCATION_MARKETS: LocationMarket[] = [
  {
    slug: "uganda",
    countryName: "Uganda",
    shortName: "Uganda",
    metaTitle: "Website Design & Development in Uganda | VeilCode",
    metaDescription:
      "VeilCode is Kampala's digital product agency. We build conversion-focused websites, mobile apps, and AI automation systems for Ugandan businesses ready to grow.",
    ogImage: "/assets/og/uganda.jpg",
    schemaType: "LocalBusiness",
    addressLocality: "Kampala",
    addressCountry: "UG",
    eyebrow: "Based in Kampala · Serving Uganda & East Africa",
    locationBadge: "Kampala, Uganda",
    h1: "Websites and apps for Ugandan businesses, with Mobile Money and WhatsApp built in",
    heroCopy:
      "We build websites, mobile apps, and AI automation systems that give Ugandan businesses a real competitive edge - built for local realities, engineered to global standards.",
    statLine: "Kampala-based · Meet in person · Mobile-first by default",
    stats: ["Kampala-based", "Meet in person", "Mobile-first by default"],
    secondaryCtaLabel: "See Our Work",
    secondaryCtaHref: "/work",
    whyTitle: "Built for how Uganda does business",
    painPoints: [
      {
        title: "Most business happens on mobile",
        body: "Most Ugandan web traffic is mobile. We design mobile-first, optimise for slower connections, and integrate WhatsApp workflows where your customers already are.",
      },
      {
        title: "Trust is earned locally",
        body: "Ugandan buyers need to know who they're dealing with. We're Kampala-based, available for in-person discovery, and you can see our builds before you commit.",
      },
      {
        title: "The digital gap is your opportunity",
        body: "Most competitors in your industry still have weak or non-existent digital infrastructure. A well-built website or mobile app is a significant competitive advantage right now.",
      },
    ],
    deliveryTitle: "How we work with Ugandan clients",
    deliveryNotes: [
      "In-person discovery and kickoff are available in Kampala for teams that want a local partner they can meet before the build starts.",
      "Mobile money payment flows, including MTN MoMo and Airtel Money, can be supported in websites, mobile apps, and billing systems.",
      "WhatsApp-first communication and project updates are available if that is how your team already works.",
      "Low-bandwidth performance optimisation is included by default so launches work for real Ugandan network conditions.",
      "We can support a Uganda-first launch with an East Africa expansion path when your product is ready to grow beyond the home market.",
    ],
    pricingContext:
      "We scope projects around local business realities while keeping the engineering standard suitable for global markets.",
    industriesTitle: "Industries we serve in Uganda",
    industries: [
      {
        title: "Real Estate",
        desc: "Property listing platforms, inquiry systems, and lead-generating web development Uganda teams can manage.",
        href: "/services/web-solutions",
      },
      {
        title: "Healthcare",
        desc: "Appointment systems, patient portals, mHealth, and mobile app development Uganda clinics can roll out in stages.",
        href: "/services/mobile-applications",
      },
      {
        title: "Education",
        desc: "LMS platforms, school management systems, parent portals, and performance-conscious student experiences.",
        href: "/services/web-solutions",
      },
      {
        title: "Financial Services / Fintech",
        desc: "Mobile money integrations, lending platforms, and AI automation Uganda finance teams can audit and control.",
        href: "/services/ai-automation",
      },
      {
        title: "Retail & E-commerce",
        desc: "Online stores optimised for product discovery, conversion, local payment methods, and WhatsApp-assisted sales.",
        href: "/services/web-solutions",
      },
      {
        title: "Professional Services",
        desc: "Conversion-focused sites for law firms, consultancies, accounting practices, and B2B service providers.",
        href: "/services/web-solutions",
      },
    ],
    serviceFocus: ["web", "mobile", "ai"],
    portfolioTitle: "Work that performs",
    portfolioItems: [
      {
        slug: "bienvenidos-apartments",
        relevanceNote:
          "Real estate platforms like this give property businesses in Uganda 24/7 inquiry generation - without relying on phone calls alone.",
      },
      {
        slug: "nexus-commerce",
        relevanceNote:
          "E-commerce built for product discovery and conversion - applicable to Ugandan retail businesses moving online.",
      },
      {
        slug: "vantage-ai-agents",
        relevanceNote:
          "AI-powered outreach and workflow tools built from Kampala - proof that world-class SaaS products can be built here.",
      },
    ],
    portfolioCta: "Building something for the Ugandan market? Let's talk.",
    faqTitle: "Questions from Ugandan businesses",
    faqs: [
      {
        question: "Are you actually based in Uganda, or is this just an online listing?",
        answer:
          "We're based in Kampala. VeilCode Studio operates locally, and in-person discovery and project meetings are available for clients who prefer face-to-face engagement. You can reach us directly before committing to anything.",
      },
      {
        question: "Can you integrate MTN Mobile Money or Airtel Money into our platform?",
        answer:
          "Yes. Mobile money payment integration is a core capability for Ugandan builds. We can structure your checkout or billing system around the payment methods your customers already use.",
      },
      {
        question: "Do you only build for Kampala businesses?",
        answer:
          "No. We work with businesses across Uganda, and can run remote discovery, design reviews, and full delivery for teams outside Kampala. We can structure your product for expansion beyond Uganda.",
      },
      {
        question: "How do your prices compare to local agencies?",
        answer:
          "We scope projects around local business realities. We're not the cheapest option - we're the option that delivers what's in the scope. We're transparent about scope and cost before any work begins.",
      },
      {
        question: "Can you take over an existing website that isn't performing?",
        answer:
          "Yes. We can audit what exists, identify what's holding it back, and either improve or rebuild from there depending on what makes more business sense.",
      },
    ],
    ctaLabel: "Start a Conversation",
    ctaCopy: "Your business deserves infrastructure that works.",
    ctaBody:
      "Whether you're starting from scratch or replacing something broken, we'll give you a clear scope, honest timeline, and a product your customers will actually use.",
    crossMarketLabel: "Also serving clients in:",
    crossMarketLinks: [
      { label: "United States", href: "/locations/united-states" },
      { label: "United Kingdom", href: "/locations/united-kingdom" },
      { label: "Canada", href: "/locations/canada" },
      { label: "Australia", href: "/locations/australia" },
    ],
  },
  {
    slug: "united-states",
    countryName: "United States",
    shortName: "USA",
    metaTitle: "Remote Web, Mobile & AI Automation Agency for US Companies | VeilCode",
    metaDescription:
      "VeilCode partners with US founders and operators who need senior web, mobile, and AI automation delivery without the cost of a large domestic agency. Remote-first, outcome-driven.",
    ogImage: "/assets/og/united-states.jpg",
    schemaType: "ProfessionalService",
    areaServed: "US",
    eyebrow: "Remote delivery for US teams · Eastern Time overlap available",
    h1: "Senior product engineering for US founders who need to move fast",
    heroCopy:
      "We partner with US startups, operators, and growth teams to ship web platforms, mobile apps, and AI automation systems - lean delivery, senior execution, no bloated agency overhead.",
    primaryCtaLabel: "Book a Discovery Call",
    primaryCtaHref: "/start",
    secondaryCtaLabel: "See Case Studies",
    secondaryCtaHref: "/work",
    statLine: "NDA-ready · Milestone billing · IP ownership included · Eastern Time overlap available",
    stats: ["NDA-ready", "Milestone billing", "IP ownership included", "Eastern Time overlap available"],
    whyTitle: "Best fit for US teams",
    painPoints: [
      {
        title: "Early-stage founders",
        body: "You have funding, a clear product vision, and a 90-day launch target. You need a senior team that can move without handholding.",
      },
      {
        title: "Operators scaling ops",
        body: "You're running growth and your internal team is maxed out. You need a reliable delivery partner for the build while your team focuses on the business.",
      },
      {
        title: "Agencies with overflow",
        body: "You have client work you can't staff internally. We act as your engineering execution layer with clean, documented code you can hand back to the client.",
      },
    ],
    detailSections: [
      {
        title: "Timezone",
        body: "Our afternoon overlaps with your morning. Live reviews run 8 to 11 AM Eastern (3 to 6 PM in Kampala) during US daylight saving time, or 4 to 7 PM in Kampala during US standard time. Written updates land before your day starts.",
      },
      {
        title: "Accountability",
        body: "Every project runs on a written scope, milestone delivery plan, and a shared project dashboard. You know what's being built, when it's due, and what it costs - before a line of code is written.",
      },
      {
        title: "Quality",
        body: "Our stack (Next.js, React Native, TypeScript, Supabase) is the same stack US engineering teams use. Code is documented, tested, and structured for handover or in-house continuation. We know US buyers may not see a long list of US testimonials yet, so we lead with scope clarity, process documentation, and work you can inspect.",
      },
    ],
    detailTitle: "The remote concerns - addressed directly",
    deliveryTitle: "What working with us looks like",
    deliveryNotes: [
      "Discovery (Week 1): scoped proposal, NDA, and tech stack confirmation before the build starts.",
      "Build (Weeks 2-8): milestone sprints, async updates, and weekly review calls keep progress visible.",
      "QA & Launch (Week 8-9): testing, staging review, and production deployment happen before final sign-off.",
      "Handover (Week 10): source code, documentation, analytics setup, and ownership details are transferred.",
    ],
    pricingContext:
      "US clients usually engage us when they want senior product execution without the cost structure of a large domestic agency.",
    industriesTitle: "Products we build for US markets",
    industries: [
      "SaaS MVPs and customer portals",
      "Startup marketing sites and dashboards",
      "E-commerce and subscription workflows",
      "Healthcare and professional service platforms",
      "Agency delivery overflow",
    ],
    servicesTitle: "What US teams hire us for",
    serviceCards: [
      {
        title: "Web Solutions",
        desc: "Marketing sites, SaaS dashboards, customer portals, and internal tools built on Next.js - optimised for performance, SEO, and conversion in competitive US markets.",
        href: "/services/web-solutions",
        accentClass: "text-svc-web",
      },
      {
        title: "Mobile Applications",
        desc: "Cross-platform iOS and Android apps built with React Native. Designed for the App Store, built for retention, delivered with documentation your team can maintain.",
        href: "/services/mobile-applications",
        accentClass: "text-svc-mobile",
      },
      {
        title: "AI Automation",
        desc: "Workflow automation connecting your CRM, email, forms, support queue, and reporting. LLM integrations and custom AI agents that reduce manual ops without creating new fragility.",
        href: "/services/ai-automation",
        accentClass: "text-svc-ai",
      },
    ],
    serviceFocus: ["web", "mobile", "ai"],
    portfolioTitle: "Work you can inspect",
    portfolioCta: "Need a web development agency for US startups or a remote software agency for US companies? Start with a written scope.",
    faqTitle: "What US clients ask before they hire us",
    faqs: [
      {
        question: "You're based in Uganda - why would we hire you over a US agency?",
        answer:
          "Because geography doesn't determine quality. Our stack, process, and delivery standards are identical to what a senior US engineering team would produce - at a cost structure that makes more sense for a founder or operator who needs results, not overhead. We don't ask you to take that on faith: we scope everything in writing before work begins, you own all IP from day one, and you can stop at any milestone.",
      },
      {
        question: "How do you handle the timezone difference?",
        answer:
          "We schedule live calls in your morning, which is our afternoon, and send a written update every day.",
      },
      {
        question: "Do you sign NDAs?",
        answer:
          "Yes, before any project detail is shared. We can review your standard NDA or provide ours.",
      },
      {
        question: "Who owns the code?",
        answer:
          "You do. Full IP transfer is standard. The codebase, designs, and documentation are yours on final payment.",
      },
      {
        question: "Can you integrate with our existing US SaaS tools?",
        answer:
          "Yes. We commonly connect HubSpot, Stripe, Twilio, Intercom, Zapier, Airtable, Notion, and custom APIs. If it has an API, we can integrate it.",
      },
      {
        question: "What's your typical project size?",
        answer:
          "Larger custom US engagements run between $5,000 and $30,000 depending on scope. Website packages cover a smaller, defined scope. Scope is fixed in writing before we start.",
      },
    ],
    ctaLabel: "Book a Call",
    ctaCopy: "Book a no-commitment discovery call.",
    ctaBody:
      "30 minutes. You explain the goal. We tell you whether we're the right fit and what it would take. No sales deck, no pressure.",
    crossMarketLabel: "Also serving:",
    crossMarketLinks: [
      { label: "Uganda", href: "/locations/uganda" },
      { label: "United Kingdom", href: "/locations/united-kingdom" },
      { label: "Canada", href: "/locations/canada" },
      { label: "Australia", href: "/locations/australia" },
    ],
  },
  {
    slug: "united-kingdom",
    countryName: "United Kingdom",
    shortName: "UK",
    metaTitle: "Digital Product Agency for UK Businesses | Web, Mobile & AI | VeilCode",
    metaDescription:
      "VeilCode builds web platforms, mobile apps, and AI automation systems for UK SMEs and growth-stage businesses. GDPR-aware delivery, accessibility-conscious builds, documented delivery.",
    ogImage: "/assets/og/united-kingdom.jpg",
    schemaType: "ProfessionalService",
    areaServed: "GB",
    eyebrow: "Remote delivery for UK teams · 2 hours ahead of the UK in summer, 3 in winter",
    h1: "Web, mobile and AI systems for UK businesses with measurable growth targets",
    heroCopy:
      "We help UK SMEs, agencies, and growth-stage teams ship digital products that convert, automate the work that slows them down, and build the kind of digital credibility that closes deals.",
    primaryCtaLabel: "Start a Project",
    primaryCtaHref: "/start",
    secondaryCtaLabel: "View Case Studies",
    secondaryCtaHref: "/work",
    statLine: "GDPR-aware builds · Accessible by default · ROI-focused delivery · 2 hours ahead of the UK in summer, 3 in winter",
    stats: [
      "GDPR-aware builds",
      "Accessible by default",
      "ROI-focused delivery",
      "2 hours ahead of the UK in summer, 3 in winter",
    ],
    whyTitle: "What we optimise for in the UK market",
    painPoints: [
      {
        title: "Digital credibility that closes deals",
        body: "UK buyers research online before they pick up the phone. Your website, portfolio, and digital presence either build trust in the first 5 seconds or lose the lead. We build for first impressions that hold up under scrutiny.",
      },
      {
        title: "Compliance is not optional",
        body: "GDPR, cookie consent, data handling, and accessibility (WCAG 2.1 AA) aren't afterthoughts in the UK market. We build them in from the start - not as bolt-ons after launch.",
      },
      {
        title: "ROI over aesthetics",
        body: "UK buyers want to know what the website does for the business, not just how it looks. We build with conversion paths, analytics, and measurement built in - so you can answer that question.",
      },
    ],
    detailSections: [
      {
        title: "2 hours ahead of the UK in summer, 3 in winter",
        body: "Unlike agencies based in Asia or the Americas, we're only 2 hours ahead of UK time during the summer and 3 in the winter. Morning standups, same-day feedback, and real-time reviews are practical - not exceptional.",
        ctaLabel: "Read our SEO thinking",
        ctaHref: "/blog/seo-thinking-for-business-websites",
      },
    ],
    deliveryTitle: "How delivery works for UK clients",
    deliveryNotes: [
      "Written scope and fixed milestone structure are agreed before any work begins.",
      "Real-time availability during UK business hours is practical given the 2 to 3 hour time difference.",
      "Structured handover documentation is prepared for internal teams or future agency partners.",
      "Accessibility and GDPR-conscious builds included by default.",
      "Analytics and conversion tracking set up at launch, not retrospectively.",
    ],
    pricingContext:
      "UK clients usually come to us for senior execution, clear scope control, and measurable commercial outcomes. This page is written for digital agency for UK businesses, web development agency UK, and AI automation UK SME searches while still reading like a serious British business page.",
    industriesTitle: "Sectors we work with in the UK",
    industries: [
      "Professional Services (law, accounting, consulting)",
      "Property & Real Estate",
      "Education & EdTech",
      "Healthcare & Health Tech",
      "B2B SaaS",
      "E-commerce",
    ],
    servicesTitle: "What UK teams hire us for",
    serviceCards: [
      {
        title: "Web Solutions",
        desc: "High-performance websites and web platforms built on Next.js. Fast, technically sound, SEO-optimised, and designed for the conversion paths that UK buyers follow.",
        href: "/services/web-solutions",
        accentClass: "text-svc-web",
      },
      {
        title: "Mobile Applications",
        desc: "Cross-platform iOS and Android apps built for the UK consumer market. We design for the high usability expectations of UK app users - clean, accessible, and fast.",
        href: "/services/mobile-applications",
        accentClass: "text-svc-mobile",
      },
      {
        title: "AI Automation",
        desc: "Internal workflow automation, CRM integration, reporting systems, and custom AI agents. We help UK service businesses reduce admin overhead without introducing new complexity.",
        href: "/services/ai-automation",
        accentClass: "text-svc-ai",
      },
    ],
    serviceFocus: ["web", "mobile", "ai"],
    faqTitle: "Questions UK clients ask",
    faqs: [
      {
        question: "You're based in Uganda - is that a problem for a UK business?",
        answer:
          "Practically, no. We're 2 hours ahead of UK time in summer and 3 in winter, which means real-time collaboration during business hours is straightforward. We've structured our delivery model around written scopes, milestone reviews, and reliable async updates - the same discipline a good UK agency should apply. The work is the same. The overhead is lower.",
      },
      {
        question: "Do you build GDPR-compliant websites?",
        answer:
          "Yes. Cookie consent management, privacy policy integration, data handling practices, and analytics setup are all part of our standard delivery for UK clients. We won't ship a site that puts your business at compliance risk.",
      },
      {
        question: "Do you build to WCAG accessibility standards?",
        answer:
          "Yes. Semantic HTML, keyboard navigation, colour contrast, and screen reader compatibility are part of our build standards - not an optional extra.",
      },
      {
        question: "Can you work alongside our existing UK marketing or product team?",
        answer:
          "Yes. We can operate as a delivery partner for your internal team, as a white-label resource for a UK agency, or as the primary build team. We adapt to the structure that makes sense for your project.",
      },
      {
        question: "Can you take over an existing website?",
        answer:
          "Yes. We audit the current stack, identify what's holding it back, and recommend whether improvement or a rebuild makes better commercial sense. We won't recommend a rebuild to inflate the invoice.",
      },
    ],
    ctaLabel: "Start the conversation",
    ctaCopy: "Tell us what needs to perform better.",
    ctaBody:
      "We'll scope it, price it, and tell you honestly whether we're the right fit - before you commit to anything.",
    crossMarketLabel: "Also serving:",
    crossMarketLinks: [
      { label: "Uganda", href: "/locations/uganda" },
      { label: "United States", href: "/locations/united-states" },
      { label: "Canada", href: "/locations/canada" },
      { label: "Australia", href: "/locations/australia" },
    ],
  },
  {
    slug: "canada",
    countryName: "Canada",
    shortName: "Canada",
    metaTitle: "Web, Mobile & AI Automation Agency for Canadian Companies | VeilCode",
    metaDescription:
      "VeilCode helps Canadian businesses build web platforms, mobile apps, and AI automation systems with senior remote delivery, clear documentation, and practical scope control.",
    ogImage: "/assets/og/canada.jpg",
    schemaType: "ProfessionalService",
    areaServed: "CA",
    eyebrow: "Remote delivery for Canadian teams · Eastern & Pacific overlap available",
    h1: "Senior digital product delivery for Canadian businesses that need focused execution",
    heroCopy:
      "We partner with Canadian startups, SMEs, and operators to build web platforms, mobile products, and workflow automation - with the documentation, scope discipline, and handover standards Canadian teams expect.",
    primaryCtaLabel: "Start a Project",
    primaryCtaHref: "/start",
    secondaryCtaLabel: "See Our Process",
    secondaryCtaHref: "/services",
    statLine: "Full IP ownership · Written scopes · Bilingual-capable builds · Documented handover",
    stats: [
      "Full IP ownership",
      "Written scopes",
      "Bilingual-capable builds",
      "Documented handover",
    ],
    whyTitle: "What we optimise for in the Canadian market",
    painPoints: [
      {
        title: "Documentation is not optional",
        body: "Canadian clients expect written specs, milestone plans, and handover notes they can pass to their internal team or a future agency. We document everything - not as a courtesy, but as a delivery standard.",
      },
      {
        title: "Bilingual capability when you need it",
        body: "We can structure products for multilingual content management from the start. French-language interface text and localisation requirements are scoped clearly - with translation reviewed by qualified specialists.",
      },
      {
        title: "Scope control over open-ended retainers",
        body: "Canadian SMEs don't want a billing relationship that never ends. We work in defined scopes with milestone billing - so you always know what's being built, what it costs, and when you're done.",
      },
    ],
    detailSections: [
      {
        title: "Working across Canadian timezones",
        body: "Our afternoon overlaps with Eastern mornings (8 to 11 AM ET). Pacific clients get early calls, 8 to 9 AM PT, which is our evening. We work async-first and document everything in writing.",
      },
    ],
    deliveryTitle: "How we work with Canadian clients",
    deliveryNotes: [
      "Written scope and cost estimate are agreed before any work begins - no verbal commitments.",
      "Milestone-based delivery includes client sign-off at each stage.",
      "Full source code and documentation are transferred at project completion.",
      "Analytics and reporting are set up at launch when measurement is part of the business case.",
      "Post-launch support window available on request, typically 30 or 60 days.",
    ],
    pricingContext:
      "Canadian clients in Toronto, Vancouver, and Montreal often need senior delivery without building a full engineering team first. We frame the value around clean output, documentation, and ownership - not cheap labour. This page supports web development agency Canada, digital agency for Canadian startups, and remote software agency Canada searches without turning the copy into keyword stuffing.",
    industriesTitle: "Canadian sectors we fit best",
    industries: ["SaaS", "Healthcare", "Education", "Retail", "B2B services"],
    servicesTitle: "What Canadian teams hire us for",
    serviceCards: [
      {
        title: "Web Solutions",
        desc: "High-performance web platforms built for the Canadian digital market. Technical SEO, accessibility, performance, and conversion - delivered clean enough that your internal team can maintain it.",
        href: "/services/web-solutions",
        accentClass: "text-svc-web",
      },
      {
        title: "Mobile Applications",
        desc: "Cross-platform iOS and Android apps built with React Native. Designed to meet the high quality bar of Canadian app users across both English and French markets.",
        href: "/services/mobile-applications",
        accentClass: "text-svc-mobile",
      },
      {
        title: "AI Automation",
        desc: "Workflow automation that connects your CRM, reporting, customer comms, and operations into systems that reduce admin overhead and surface better data for decisions.",
        href: "/services/ai-automation",
        accentClass: "text-svc-ai",
      },
    ],
    serviceFocus: ["web", "mobile", "ai"],
    faqTitle: "Questions Canadian clients ask",
    faqs: [
      {
        question: "You're based in Uganda - why should a Canadian business work with you?",
        answer:
          "Because you're paying for the output, not the postcode. Our delivery process - written scopes, milestone billing, documented handover - is the same discipline you'd expect from a senior Canadian agency, at a cost structure that makes sense for a company that's not ready to hire a full engineering team. You own everything we build, from day one.",
      },
      {
        question: "Can you build bilingual (English and French) websites?",
        answer:
          "Yes. We architect products to support multilingual content from the start - meaning French localisation can be added without rebuilding the site. We strongly recommend working with a qualified French-language translator for the copy itself. We scope the technical requirement; you source the language expertise.",
      },
      {
        question: "What does documentation look like at handover?",
        answer:
          "Every project includes: component-level code comments, a README with setup and deployment instructions, environment variable documentation, and a handover brief covering the key decisions made during build. Your team or any future developer should be able to pick it up without calling us.",
      },
      {
        question: "Do you offer post-launch support?",
        answer:
          "Yes. We offer defined post-launch support windows, typically 30 or 60 days, and can scope ongoing maintenance or feature development as a separate engagement after the initial build.",
      },
      {
        question: "What payment methods do you accept from Canadian clients?",
        answer:
          "We accept international wire transfer and major online payment platforms. Invoices are issued in USD. We're happy to discuss CAD invoicing for larger engagements.",
      },
    ],
    ctaLabel: "Get a Project Scope",
    ctaCopy: "Clear scope. Clean delivery. No surprises.",
    ctaBody:
      "Tell us what you're building. We'll come back with an honest scope, a realistic timeline, and a clear price.",
    crossMarketLabel: "Also serving:",
    crossMarketLinks: [
      { label: "Uganda", href: "/locations/uganda" },
      { label: "United States", href: "/locations/united-states" },
      { label: "United Kingdom", href: "/locations/united-kingdom" },
      { label: "Australia", href: "/locations/australia" },
    ],
  },
  {
    slug: "australia",
    countryName: "Australia",
    shortName: "Australia",
    metaTitle: "Web, Mobile & AI Automation Agency for Australian Businesses | VeilCode",
    metaDescription:
      "VeilCode helps Australian businesses ship web platforms, mobile apps, and automation systems with senior remote delivery, full IP ownership, and the process discipline offshore work often lacks.",
    ogImage: "/assets/og/australia.jpg",
    schemaType: "ProfessionalService",
    areaServed: "AU",
    eyebrow: "Remote delivery for Australian teams · AEDT/AEST overlap scheduled",
    h1: "Offshore development done right - for Australian businesses that have been burned before",
    heroCopy:
      "We're not the cheapest offshore option. We're the one that delivers what's in the scope, documents everything, and gives you full ownership of the output. If you've had a bad offshore experience, here is how we work differently.",
    primaryCtaLabel: "Start with a Discovery Sprint",
    primaryCtaHref: "/start",
    secondaryCtaLabel: "See Our Work",
    secondaryCtaHref: "/work",
    statLine: "Full IP ownership · Pilot project available · Written scopes · AEDT overlap scheduled",
    stats: [
      "Full IP ownership",
      "Pilot project available",
      "Written scopes",
      "AEDT overlap scheduled",
    ],
    whyTitle: "What goes wrong with offshore development - and how we're different",
    painPoints: [
      {
        title: "Vague scope, scope creep, surprise invoices",
        body: "VeilCode works from a written scope and fixed milestone pricing before work begins. Changes are scoped and priced separately so offshore web development Australia teams can evaluate stays commercially clear.",
      },
      {
        title: "Work disappears into a timezone black hole",
        body: "VeilCode uses daily async updates, scheduled review calls at AEDT-compatible times, and a shared project board you can check at any time.",
      },
      {
        title: "You don't own the code after the project",
        body: "VeilCode includes full IP transfer on final payment. Source code, documentation, design files, and deployment access are handed over to your business.",
      },
      {
        title: "Quality doesn't match the samples shown in the pitch",
        body: "VeilCode offers a Discovery Sprint before any full engagement. Assess our thinking, communication, and technical direction before you commit to a larger build.",
      },
    ],
    detailSections: [
      {
        title: "Start small. Trust what you see.",
        body: "We offer a scoped Discovery Sprint: a 1-2 week engagement covering requirements mapping, technical architecture, wireframes or prototypes, and a full project plan. You see exactly how we think and work before committing to a full build. If you're not satisfied with the output, you don't proceed. The sprint is priced on its own, so you can stop there if it isn't a fit.",
        ctaLabel: "Ask about a Discovery Sprint",
        ctaHref: "/start",
      },
      {
        title: "Timezone management - honest and practical",
        body: "Australia and Uganda have a 5-8 hour offset depending on your state. We won't pretend that's nothing. Daily written project updates are sent each morning EAT, which lands in your inbox during Australian business hours. Review calls run in your late afternoon, which is our morning: 4 to 6 PM AEDT, 1 to 3 PM in Perth. For AEST and Perth clients we work flexible evening hours when needed. You won't lose a working day waiting for a response.",
      },
      {
        title: "Agency project work vs. offshore hiring",
        body: "After Pascua v Doessel, Australian businesses are right to ask how offshore work is structured. VeilCode engages Australian clients as a project-based service provider under a standard agency agreement - not as a direct hire arrangement. This is a straightforward commercial services relationship with clear IP and IP transfer terms. We recommend you review our agreement with your legal team before engagement.",
      },
    ],
    deliveryTitle: "How Australian engagements run",
    deliveryNotes: [
      "Week 1-2: Discovery Sprint, optional but recommended - requirements, architecture, prototypes, and project plan.",
      "Week 3-8: Build - milestone sprints, daily async updates, and weekly review calls scheduled for AEDT-compatible overlap.",
      "Week 8-9: QA and staging review - your team tests on staging and signs off before production.",
      "Week 10: Handover - full source code, documentation, deployment access, and IP ownership transferred.",
    ],
    pricingContext:
      "Australian clients usually benefit from our remote software development agency Australia model when they need senior execution and predictable scope without local agency overhead.",
    serviceCards: [
      {
        title: "Web Solutions",
        desc: "Web platforms built on Next.js for the Australian market. Fast, accessible, technically sound, and optimised for mobile-first Australian traffic patterns.",
        href: "/services/web-solutions",
        accentClass: "text-svc-web",
      },
      {
        title: "Mobile Applications",
        desc: "iOS and Android apps built with React Native. Designed for the quality bar of the Australian App Store market, with full handover documentation.",
        href: "/services/mobile-applications",
        accentClass: "text-svc-mobile",
      },
      {
        title: "AI Automation",
        desc: "Workflow automation that eliminates the manual admin, reporting, and communication overhead that slows Australian service businesses down - without creating fragile black-box systems.",
        href: "/services/ai-automation",
        accentClass: "text-svc-ai",
      },
    ],
    industriesTitle: "Australian teams we fit best",
    industries: ["Property", "Retail", "Professional services", "Education", "Health and wellness"],
    portfolioTitle: "Work with clear ownership and documented scope",
    portfolioItems: [
      {
        slug: "bienvenidos-apartments",
        relevanceNote:
          "Property platforms like this show how a digital agency for Australian businesses can turn search, listings, and inquiries into a measurable sales channel.",
      },
      {
        slug: "nexus-commerce",
        relevanceNote:
          "Mobile-first commerce and checkout performance are directly relevant for Sydney, Melbourne, and regional Australian retailers competing online.",
      },
      {
        slug: "vantage-ai-agents",
        relevanceNote:
          "AI automation work like this reduces manual review and reporting overhead without creating a black-box system your team cannot own.",
      },
    ],
    portfolioCta: "Want to assess us before a full build? Start with a Discovery Sprint.",
    faqTitle: "Questions from Australian businesses",
    serviceFocus: ["web", "mobile", "ai"],
    faqs: [
      {
        question: "We've had bad experiences with offshore agencies before. Why would this be different?",
        answer:
          "Because we structure things differently. We won't start work without a written scope. We bill by milestone, not by the month. You own everything we build. And we offer a Discovery Sprint so you can see how we work before you commit to a full project. If that process isn't reassuring enough, we're probably not the right fit - and we'd rather tell you that upfront.",
      },
      {
        question: "How do you handle the timezone gap?",
        answer:
          "Honestly. There is a 5-8 hour offset between Uganda and Australia. Our response: daily written updates arrive in your inbox during Australian business hours. Review calls run in your late afternoon, which is our morning: 4 to 6 PM AEDT, 1 to 3 PM in Perth. We don't pretend the timezone doesn't exist - we design the workflow around it.",
      },
      {
        question: "Do we own the code at the end?",
        answer:
          "Yes. Full IP transfer on final payment is standard in our agreements. Source code, design files, deployment access - everything.",
      },
      {
        question: "Can we start small to test the relationship?",
        answer:
          "Yes. We recommend it. Our Discovery Sprint, usually 1-2 weeks, produces requirements documentation, a technical architecture plan, and prototypes or wireframes. The sprint is priced on its own, so you can stop there if it isn't a fit.",
      },
      {
        question: "Is this a direct hire arrangement or a project engagement?",
        answer:
          "It's a commercial project engagement between VeilCode Studio (Uganda) and your business. Not a direct hire arrangement. We provide deliverables under a standard agency services agreement, which includes IP transfer terms.",
      },
    ],
    ctaLabel: "Book a Discovery Sprint",
    ctaCopy: "Not ready for a full build? Start with a Discovery Sprint.",
    ctaBody:
      "Two weeks. Written requirements, technical architecture, prototypes. You see exactly how we work - before committing to anything larger.",
    crossMarketLabel: "Also serving clients in:",
    crossMarketLinks: [
      { label: "Uganda", href: "/locations/uganda" },
      { label: "United States", href: "/locations/united-states" },
      { label: "United Kingdom", href: "/locations/united-kingdom" },
      { label: "Canada", href: "/locations/canada" },
    ],
  },
];

export function getLocationMarket(slug: string) {
  return LOCATION_MARKETS.find((market) => market.slug === slug) ?? null;
}

/** ISO country code a market targets, e.g. "US" for /locations/united-states. */
export function getMarketCountryCode(market: LocationMarket) {
  const served = Array.isArray(market.areaServed) ? market.areaServed[0] : market.areaServed;
  return (served ?? market.addressCountry ?? null)?.toUpperCase() ?? null;
}

/** Finds the location market for an SEO page's country code. */
export function getLocationMarketByCountryCode(code: string | null | undefined) {
  if (!code) return null;
  const upper = code.toUpperCase();
  return LOCATION_MARKETS.find((market) => getMarketCountryCode(market) === upper) ?? null;
}
