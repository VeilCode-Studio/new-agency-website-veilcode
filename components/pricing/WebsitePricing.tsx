import "server-only";
import Link from "next/link";
import { ArrowUpRight, CircleCheck, Star } from "lucide-react";
import { getWebsitePricing, WEBSITE_PRICING_ENABLED } from "./pricing-data";
import styles from "./website-pricing.module.css";

/** One removable, server-rendered section shared by home and all location pages. */
export function WebsitePricing({ market = "uganda", homepage = false }: { market?: string; homepage?: boolean }) {
  if (!WEBSITE_PRICING_ENABLED) return null;
  const pricing = getWebsitePricing(market);
  if (!pricing) return null;

  return (
    <section id="pricing" className={styles.section} aria-labelledby="website-pricing-title" data-pricing-market={market}>
      <div className={styles.container}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>Website design pricing</p>
          <h2 id="website-pricing-title">{homepage ? "The right investment for your next step." : `Website packages for ${pricing.audience}.`}</h2>
          <p>Choose a website package that fits your next step, from a professional online presence to a complete online store.</p>
        </header>
        <div className={styles.grid}>
          {pricing.plans.map((plan) => (
            <article key={plan.id} className={`${styles.card} ${plan.featured ? styles.featured : ""}`} aria-labelledby={`pricing-${plan.id}`}>
              {plan.featured && <span className={styles.badge}><Star size={12} aria-hidden="true" />Most Popular</span>}
              <div className={styles.intro}>
                <h3 id={`pricing-${plan.id}`}>{plan.name}</h3>
                <p>{plan.description}</p>
              </div>
              <div className={styles.price}>
                {pricing.startingFrom && <span className={styles.priceLabel}>From</span>}
                <strong>{plan.price}</strong>
                <span className={styles.unit}>/ project</span>
              </div>
              <ul>
                {plan.features.map((feature) => <li key={feature}><CircleCheck size={17} aria-hidden="true" /><span>{feature}</span></li>)}
              </ul>
              <Link href="/start" prefetch={false} className={styles.button} aria-label={`${plan.cta} — ${plan.name} website package`}>
                {plan.cta}<ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            </article>
          ))}
        </div>
        <div className={styles.notes}>
          <p>Final scope, price and billing currency are confirmed in your proposal. Mobile apps, AI automation and larger custom builds are scoped separately.</p>
          <Link href="/contact" prefetch={false} className={styles.contact}>Need a different scope? Talk to us<ArrowUpRight size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  );
}
