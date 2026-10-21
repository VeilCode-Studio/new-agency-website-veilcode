/** Set to false to remove the shared pricing section from home and every location. */
export const WEBSITE_PRICING_ENABLED = true;

// Approved regional starting prices, in each market's own currency.
// These explicit amounts supersede the previous researched-benchmark discount.
export const REGIONAL_PACKAGE_PRICES = {
  "united-states": { starter: 1_500, business: 2_900, ecommerce: 4_500 },
  "united-kingdom": { starter: 1_200, business: 2_300, ecommerce: 3_500 },
  canada: { starter: 2_000, business: 3_900, ecommerce: 6_000 },
  australia: { starter: 2_200, business: 4_300, ecommerce: 6_800 },
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
  const regionalPrices = Object.hasOwn(REGIONAL_PACKAGE_PRICES, marketSlug)
    ? REGIONAL_PACKAGE_PRICES[marketSlug as keyof typeof REGIONAL_PACKAGE_PRICES]
    : null;
  if (!local && !regionalPrices) return null;
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
      marketSlug === "united-states" || marketSlug === "canada" ? "SMS and email order alerts" : "WhatsApp ordering",
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
      const amount = regionalPrices?.[plan.id] ?? plan.ugxPrice;
      return {
        ...plan,
        amount,
        price: `${market.currency} ${formatter.format(amount)}`,
        featured: plan.id === "business",
        features: features[plan.id],
      };
    }),
  };
}
