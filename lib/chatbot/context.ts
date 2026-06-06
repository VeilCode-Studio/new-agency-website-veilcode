import { DEEP_DIVES, FAQS, PROJECTS, TIERS } from "@/constants";

export function getVeilCodeChatbotContext() {
  const services = DEEP_DIVES.map((service) => {
    const bullets = service.bullets?.slice(0, 4).join("; ") ?? "";
    return `- ${service.title}: ${service.tagline}. ${service.intro} Key capabilities: ${bullets}`;
  }).join("\n");

  const pricing = TIERS.map(
    (tier) => `- ${tier.name}: ${tier.price}. ${tier.desc}`,
  ).join("\n");

  const faqs = FAQS.slice(0, 6)
    .map((faq) => `- Q: ${faq.q}\n  A: ${faq.a}`)
    .join("\n");

  const projects = PROJECTS.map(
    (project) =>
      `- ${project.title}: ${project.tag}. ${project.desc} Result: ${project.metric} ${project.metricLabel}.`,
  ).join("\n");

  return `
VeilCode Studio builds conversion-focused websites, mobile applications, and AI automation systems for businesses that need better digital infrastructure.

Services:
${services}

Pricing:
${pricing}

Selected case studies:
${projects}

FAQs:
${faqs}

Process:
- Discovery call to understand goals, constraints, timeline, and budget.
- Proposal and scoping before commitment.
- Design and architecture before development.
- Iterative build, QA, handover, launch support.

Lead capture rules:
- Qualify service, project goal, budget, timeline, name, email, and company if offered.
- Do not promise exact availability, exact pricing beyond the listed starting points, or legal/financial advice.
- Route serious project requests into the project inquiry flow.
- Public response expectation: VeilCode responds within one business day.
`.trim();
}
