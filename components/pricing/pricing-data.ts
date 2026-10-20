/** Set to false to remove the shared pricing section from home and every location. */
export const WEBSITE_PRICING_ENABLED = true;

export const REGIONAL_DISCOUNT_PERCENT = 15;
// Scope-adjusted planning estimates researched on 21 October 2026, in each
// market's own currency. Sources and rationale: docs/redesign/pricing-research.md.
// These are estimates for comparable packages, not surveyed national averages.
export const REGIONAL_PRICE_BENCHMARKS = {
  "united-states": { starter: 4_000, business: 7_000, ecommerce: 10_000 },
  "united-kingdom": { starter: 1_500, business: 3_000, ecommerce: 4_000 },
  canada: { starter: 4_000, business: 6_500, ecommerce: 9_000 },
  australia: { starter: 5_000, business: 8_000, ecommerce: 10_000 },
} as const;

type Currency = "UGX" | "USD" | "GBP" | "CAD" | "AUD";
export type PricingMarket = {
  currency: Currency;
  locale: string;
  audience: string;
  customerLabel: string;
};

export const PRICING_MARKETS: Record<string, PricingMarket> = {
  uganda: { currency: "UGX", locale: "en-UG", audience: "Ugandan businesses", customerLabel: "Ugandan users" },
  "united-states": { currency: "USD", locale: "en-US", audience: "US businesses", customerLabel: "US users" },
  "united-kingdom": { currency: "GBP", locale: "en-GB", audience: "UK businesses", customerLabel: "UK users" },
  canada: { currency: "CAD", locale: "en-CA", audience: "Canadian businesses", customerLabel: "Canadian users" },
  australia: { currency: "AUD", locale: "en-AU", audience: "Australian businesses", customerLabel: "Australian users" },
};

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    ugxPrice: 900_000,
    description: "Perfect for small businesses and startups that need a professional online presence",
    cta: "Choose Starter",
  },
  {
    id: "business",
    name: "Business",
    ugxPrice: 1_800_000,
    description: "Ideal for growing businesses that need advanced features and custom functionality",
    cta: "Get Started",
  },
  {
    id: "ecommerce",
    name: "Ecommerce",
    ugxPrice: 3_500_000,
    description: "Built for businesses ready to sell products or services online with full ecommerce functionality",
    cta: "Choose Ecommerce",
  },
] as const;

export function getWebsitePricing(marketSlug = "uganda") {
  const market = Object.hasOwn(PRICING_MARKETS, marketSlug) ? PRICING_MARKETS[marketSlug] : null;
  if (!market) return null;
  const local = market.currency === "UGX";
  const benchmarks = Object.hasOwn(REGIONAL_PRICE_BENCHMARKS, marketSlug)
    ? REGIONAL_PRICE_BENCHMARKS[marketSlug as keyof typeof REGIONAL_PRICE_BENCHMARKS]
    : null;
  if (!local && !benchmarks) return null;
  const common = ["Free domain name (1st year)", "Free hosting (1st year)", "1 professional email address"];
  const features = {
    starter: [
      "Up to 20 pages",
      ...common,
      `Mobile-first design optimized for ${market.customerLabel}`,
      "WhatsApp & enquiry integration",
      "Click-to-call button",
      "Google Business Profile & Maps setup",
      "Google & Local SEO setup",
      "Social media integration",
      "SSL & basic security",
      "Basic website analytics",
      "1 month free support",
    ],
    business: [
      "Unlimited pages",
      ...common,
      "Everything in Starter",
      "Advanced Local SEO",
      "Blog/News section with CMS",
      "Online booking & appointment system",
      "Lead & enquiry management",
      "Collect & follow up with customer leads",
      "Live chat integration",
      "Track visitors & customer enquiries",
      "Speed optimization",
      "Security & backups",
      "3 months free support",
      "Priority support & hosting",
    ],
    ecommerce: [
      "Unlimited pages & products",
      ...common,
      "Full ecommerce platform",
      local ? "MTN Mobile Money & Airtel Money" : "Local payment gateway integration",
      local ? "Visa/Mastercard payments (Flutterwave)" : "Visa/Mastercard payments",
      "WhatsApp ordering",
      "Product inventory management",
      "Order & customer management",
      local ? "Kampala delivery zones & fees" : "Shipping zones & delivery fees",
      "Discount & coupon system",
      "Automated order notifications",
      "Advanced SEO & marketing tools",
      "Track visitors & conversions",
      "6 months free support",
      "Priority support & hosting",
    ],
  };
  const formatter = new Intl.NumberFormat(market.locale, { maximumFractionDigits: 0 });
  return {
    ...market,
    startingFrom: !local,
    plans: PLANS.map((plan) => {
      const benchmark = benchmarks?.[plan.id] ?? null;
      const amount = benchmark === null ? plan.ugxPrice : benchmark * (100 - REGIONAL_DISCOUNT_PERCENT) / 100;
      return {
        ...plan,
        benchmark,
        amount,
        price: `${market.currency} ${formatter.format(amount)}`,
        featured: plan.id === "business",
        features: features[plan.id],
      };
    }),
  };
}
