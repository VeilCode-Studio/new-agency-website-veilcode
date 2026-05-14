# VeilCode Studio SEO Landing Pages Implementation Manual

## 1. Objective

Build a scalable SEO foundation for VeilCode Studio that supports organic visibility in Uganda, USA, UK, Canada, Australia, and other target markets.

The goal is not to create spammy location pages. The goal is to create useful, high intent landing pages that explain VeilCode Studio services clearly and match real search intent.

Core services:

1. Web Solutions
2. Mobile Applications
3. AI Automation

Supporting capabilities:

1. Technical SEO
2. Analytics and Reporting
3. API Integrations
4. Cloud Infrastructure
5. Performance Optimization
6. UX Strategy
7. Backend Systems

Data Analytics should not be a standalone headline service. It should appear as reporting, measurement, dashboards, and decision support inside Web Solutions, Mobile Applications, and AI Automation.

Social Marketing should not be part of the core service structure.

## 2. SEO Principle

Do not create pages only to manipulate rankings.

Each SEO page must be useful, specific, and written for a real buyer.

Country pages must not be identical except for the country name.

Each page should include real differences such as:

1. Local business pain points
2. Remote delivery process
3. Timezone expectations
4. Pricing context
5. Relevant industries
6. Relevant services
7. Case studies
8. FAQs
9. Strong CTA
10. Internal links

Google’s guidance prioritizes helpful, reliable, people first content. Thin duplicate SEO pages are a bad strategy.

## 3. Technical Rules

Use server side data fetching.

Do not fetch NeonDB directly from the frontend.

Use `import "server-only"` in database query modules.

Use Server Components for data access.

Use Client Components only for animation, interaction, filters, and UI state.

Client components should receive only the props they need.

Example:

```tsx
export default async function Page() {
  const services = await getPublishedServices();

  return <Services services={services} />;
}
