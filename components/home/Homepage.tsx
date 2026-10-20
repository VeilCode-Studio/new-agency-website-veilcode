import "server-only";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Code2,
  Compass,
  Globe2,
  Layers3,
  Lightbulb,
  MapPin,
  Monitor,
  MousePointer2,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { Project, Service } from "@/db/schema";
import type { BlogGridPost } from "@/lib/blog/grid";
import type { DisplayTestimonial } from "@/lib/testimonials/display";
import { FAQS, TIERS } from "@/constants";
import { getProjectKindLabel } from "@/lib/projects/kind";
import { HorizontalGallery } from "./HorizontalGallery";
import { HomeContactForm } from "./HomeContactForm";

type HomeProps = {
  services: Service[];
  projects: Project[];
  posts: BlogGridPost[];
  testimonials: DisplayTestimonial[];
};

function Action({
  href,
  children,
  secondary = false,
}: {
  href: string;
  children: ReactNode;
  secondary?: boolean;
}) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`home-button ${secondary ? "home-button-outline" : "home-button-primary"}`}
    >
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </Link>
  );
}

function Heading({
  eyebrow,
  title,
  children,
  id,
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <div className="home-section-heading">
      {eyebrow ? <span className="home-eyebrow">{eyebrow}</span> : null}
      <h2 id={id}>{title}</h2>
      {children ? <p>{children}</p> : null}
    </div>
  );
}

function Hero() {
  return (
    <section className="home-hero" aria-labelledby="home-title">
      <Image
        src="/images/home/studio-workspace.webp"
        alt=""
        fill
        sizes="(min-width: 1600px) 1600px, 100vw"
        loading="eager"
        fetchPriority="high"
        className="home-hero-photo"
      />
      <div className="home-hero-shade" aria-hidden="true" />
      <div className="home-hero-star home-hero-star-one" aria-hidden="true">
        ✦
      </div>
      <div className="home-hero-star home-hero-star-two" aria-hidden="true">
        ✦
      </div>
      <div className="home-hero-content">
        <span className="home-hero-kicker">
          <span />
          Independent studio. Kampala, Uganda.
        </span>
        <h1 id="home-title">
          Websites that turn
          <br />
          visitors into your
          <br />
          <span>next customers.</span>
        </h1>
        <p>
          Web design, mobile apps, and AI automation.
          <br className="home-desktop-break" /> Built in Kampala. Made to move
          your business forward.
        </p>
        <div className="home-hero-actions">
          <Action href="/start">Start a Project</Action>
          <Action href="/work" secondary>
            See our work
          </Action>
        </div>
        <span className="home-hero-assurance">
          Founder-led. Thoughtfully designed. Engineered to perform.
        </span>
      </div>
      <svg
        className="home-hero-wave"
        viewBox="0 0 1440 85"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0 85V42Q90-15 180 42Q270-15 360 42Q450-15 540 42Q630-15 720 42Q810-15 900 42Q990-15 1080 42Q1170-15 1260 42Q1350-15 1440 42V85Z" />
      </svg>
    </section>
  );
}

const commitments = [
  {
    value: "Direct",
    label: "Work with your engineer",
    description: "One conversation, from first idea to final build.",
  },
  {
    value: "Fixed",
    label: "A clear project scope",
    description: "Know what we’re building and what it costs.",
  },
  {
    value: "100%",
    label: "Your code. Your product.",
    description: "Full code ownership on final payment.",
  },
  {
    value: "Global",
    label: "Kampala to everywhere",
    description: "Local understanding. Remote collaboration.",
  },
];

function Commitments() {
  return (
    <section className="home-commitments home-section home-grid-background">
      <div className="home-container">
        <Heading
          eyebrow="Good work starts with trust"
          title="A better way to build your website."
        />
        <div className="home-stats-grid">
          {commitments.map((item) => (
            <article className="home-browser-card" key={item.value}>
              <div className="home-browser-bar" aria-hidden="true">
                <span />
                <span />
                <span />
                <i>veilcode.studio</i>
                <Code2 size={13} />
              </div>
              <div className="home-stat-body">
                <strong>{item.value}</strong>
                <h3>{item.label}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services({ services }: Pick<HomeProps, "services">) {
  const icons = [Monitor, Smartphone, Sparkles, Layers3];
  return (
    <section id="services" className="home-section home-services">
      <div className="home-container">
        <Heading
          eyebrow="Made for your next chapter"
          title="Website design in Kampala. Built around your business."
        >
          A beautiful first impression is only the beginning. We build useful,
          fast digital experiences that make the next step easy.
        </Heading>
        <div className="home-service-intro">
          <div className="home-device-visual">
            <span className="home-device-note">
              Designed to work beautifully.
              <ArrowUpRight size={15} aria-hidden="true" />
            </span>
            <Image
              src="/assets/bienvenidos-apartments/homepage-hero.png"
              alt="Responsive real estate website shown on a laptop"
              title="Responsive real estate website preview"
              width={1012}
              height={709}
              sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1232px) 48vw, 570px"
              loading="lazy"
            />
          </div>
          <div className="home-service-copy">
            <span className="home-eyebrow">Purpose before pixels</span>
            <h3>
              Your business deserves
              <br />
              more than a template.
            </h3>
            <p>
              We bring design and engineering together to create websites that
              feel right, load quickly, and guide people toward a meaningful
              action.
            </p>
            <p>
              From a first business website to a custom platform, you work
              directly with the person bringing it to life.
            </p>
            <Link href="/services" prefetch={false} className="home-text-link">
              Explore our services
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link
              href="/locations/uganda"
              prefetch={false}
              className="home-text-link"
            >
              Built for businesses in Uganda
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
        {services.length ? (
          <div className="home-service-grid">
            {services.slice(0, 4).map((service, index) => {
              const Icon = icons[index % icons.length];
              return (
                <article
                  className={`home-service-card home-tone-${index % 3}`}
                  key={service.id}
                >
                  <div className="home-service-orbit" aria-hidden="true">
                    <Icon size={24} />
                  </div>
                  <span className="home-card-number">0{index + 1}</span>
                  <h3>{service.title}</h3>
                  <p>{service.desc}</p>
                  <Link
                    href={
                      service.slug ? `/services/${service.slug}` : "/services"
                    }
                    prefetch={false}
                    className="home-text-link"
                  >
                    Explore service
                    <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="home-empty">
            Our services are being updated.{" "}
            <a href="/contact">Tell us what you need.</a>
          </p>
        )}
      </div>
    </section>
  );
}

const phases = [
  {
    title: "Discovery & strategy",
    icon: Compass,
    description:
      "We listen, ask the right questions, and get clear on your business, your audience, and what success should look like.",
  },
  {
    title: "Design & prototyping",
    icon: Lightbulb,
    description:
      "Your ideas become a clear visual direction. Review real layouts and user journeys before development begins.",
  },
  {
    title: "Development & integration",
    icon: Code2,
    description:
      "Thoughtful engineering brings the design to life, with the tools and integrations your business needs.",
  },
  {
    title: "Testing & refinement",
    icon: ShieldCheck,
    description:
      "We check the details across devices: accessibility, speed, functionality, and all the small things that matter.",
  },
  {
    title: "Launch & handover",
    icon: Zap,
    description:
      "We take care of deployment and the technical setup, then give you the documentation to own your product.",
  },
  {
    title: "Support & improvement",
    icon: TrendingUp,
    description:
      "Your launch is a beginning. We help you keep things healthy and plan useful improvements as your business grows.",
  },
];

function Process() {
  return (
    <section className="home-section home-process">
      <div className="home-container">
        <Heading
          eyebrow="From first hello to launch day"
          title="A clear process. No guesswork."
        >
          Six considered steps. Open communication. Something you’re proud to
          put your name on.
        </Heading>
        <ol className="home-process-grid">
          {phases.map(({ title, description, icon: Icon }, index) => (
            <li
              className={`home-process-card home-tone-${index % 3}`}
              key={title}
            >
              <div className="home-process-top">
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <span className="home-phase-tag">Phase {index + 1}</span>
              </div>
              <div className="home-process-body">
                <Icon size={23} aria-hidden="true" />
                <p>{description}</p>
                <span className="home-process-corner" aria-hidden="true" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FeaturedWork({ projects }: Pick<HomeProps, "projects">) {
  if (!projects.length) return null;
  return (
    <section className="home-section home-featured">
      <div className="home-container">
        <Heading
          eyebrow="The work speaks"
          title="Good ideas. Real-world websites."
        >
          A closer look at the products we’ve designed and built, and the
          thinking behind them.
        </Heading>
        <HorizontalGallery label="Featured projects">
          {projects.map((project) => {
            const shot = project.screenshots?.find((item) => item.src);
            return (
              <article key={project.slug} className="home-feature-slide">
                <div className="home-feature-media">
                  {shot?.src ? (
                    <Image
                      src={shot.src}
                      alt={shot.alt || `${project.title} website preview`}
                      title={
                        shot.caption || shot.alt || `${project.title} website preview`
                      }
                      fill
                      sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1232px) 55vw, 650px"
                      loading="lazy"
                      className="home-cover-image"
                    />
                  ) : (
                    <Monitor size={100} aria-hidden="true" />
                  )}
                </div>
                <div className="home-feature-copy">
                  <span className="home-eyebrow">
                    {getProjectKindLabel(project.client)} ·{" "}
                    {project.industry || project.serviceLabel}
                  </span>
                  <h3>{project.title}</h3>
                  <p>{project.summary}</p>
                  <Action href={`/work/${project.slug}`}>
                    View case study
                  </Action>
                </div>
              </article>
            );
          })}
        </HorizontalGallery>
      </div>
    </section>
  );
}

function Portfolio({ projects }: Pick<HomeProps, "projects">) {
  return (
    <section id="work" className="home-section home-portfolio">
      <div className="home-container">
        <div className="home-heading-row">
          <Heading
            eyebrow="A few things we’ve made"
            title="Recent portfolio projects."
          />
          <Link href="/work" prefetch={false} className="home-text-link">
            View all projects
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </div>
        {projects.length ? (
          <div className="home-portfolio-grid">
            {projects.map((project, index) => {
              const shot = project.screenshots?.find((item) => item.src);
              return (
                <article
                  key={project.slug}
                  className={`home-portfolio-card home-tone-${index % 3}`}
                >
                  <Link
                    href={`/work/${project.slug}`}
                    prefetch={false}
                    className="home-portfolio-image"
                    aria-label={`Explore ${project.title}`}
                  >
                    {shot?.src ? (
                      <Image
                        src={shot.src}
                        alt={shot.alt || `${project.title} preview`}
                        title={
                          shot.caption || shot.alt || `${project.title} project preview`
                        }
                        fill
                        sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 46vw, (max-width: 1232px) 30vw, 380px"
                        loading="lazy"
                        className="home-cover-image"
                      />
                    ) : (
                      <Monitor size={60} aria-hidden="true" />
                    )}
                    <span className="home-image-arrow" aria-hidden="true">
                      <ArrowUpRight size={22} />
                    </span>
                  </Link>
                  <div className="home-portfolio-caption">
                    <span>
                      {getProjectKindLabel(project.client)} ·{" "}
                      {project.serviceLabel}
                    </span>
                    <h3>
                      <Link href={`/work/${project.slug}`} prefetch={false}>
                        {project.title}
                      </Link>
                    </h3>
                    <p>{project.client}</p>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="home-empty">
            Selected work is being updated.{" "}
            <Link href="/work" prefetch={false}>
              Explore our portfolio.
            </Link>
          </p>
        )}
      </div>
    </section>
  );
}

const industries = [
  "E-commerce",
  "Real estate",
  "Hospitality",
  "Healthcare",
  "Professional services",
  "Growing businesses",
];

function Industries() {
  return (
    <section className="home-section home-industries">
      <div className="home-container">
        <Heading
          eyebrow="Different businesses. The same care."
          title="Digital solutions for the way you work."
        />
        <div className="home-industry-feature">
          <div className="home-industry-visual">
            <Image
              src="/assets/tradepost-app/image-1.jpg"
              alt="Mobile marketplace interface with product search and listings"
              title="Mobile marketplace search and product listings"
              width={720}
              height={1280}
              sizes="(max-width: 767px) 75vw, 340px"
              loading="lazy"
            />
            <span className="home-floating-label">
              <Smartphone size={19} aria-hidden="true" />
              <span>
                Made for the way
                <br />
                <strong>your customers shop.</strong>
              </span>
            </span>
          </div>
          <div className="home-industry-copy">
            <span className="home-eyebrow">
              From a storefront to a full platform
            </span>
            <h3>
              A better experience.
              <br />
              On every screen.
            </h3>
            <p>
              Help customers discover your products, explore your services, and
              take the next step wherever they are.
            </p>
            <Action href="/services/web-solutions" secondary>
              Explore web solutions
            </Action>
          </div>
        </div>
        <div className="home-industry-links">
          {industries.map((industry, index) => (
            <Link
              key={industry}
              href="/services/web-solutions"
              prefetch={false}
            >
              <span>0{index + 1}</span>
              <h3>{industry}</h3>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const benefits = [
  {
    title: "Make the right first impression",
    text: "A clear, considered website helps people understand your business and feel confident taking the next step.",
    icon: ShieldCheck,
    tag: "Trust",
  },
  {
    title: "Be easier to discover",
    text: "A sound technical SEO foundation and useful content help search engines understand what you offer.",
    icon: Search,
    tag: "Discovery",
  },
  {
    title: "Turn interest into enquiries",
    text: "Purposeful layouts, useful information, and clear calls to action give every visit a direction.",
    icon: MousePointer2,
    tag: "Conversion",
  },
  {
    title: "Meet people on mobile",
    text: "A responsive experience keeps your business usable on the phones your customers already have.",
    icon: Smartphone,
    tag: "Mobile",
  },
  {
    title: "Make room for growth",
    text: "Own a flexible digital home that can evolve with your services, your products, and your team.",
    icon: TrendingUp,
    tag: "Growth",
  },
  {
    title: "Give your time back",
    text: "Connect your forms, workflows, and tools so the repetitive work takes care of itself.",
    icon: Zap,
    tag: "Automation",
  },
];

function Benefits() {
  return (
    <section className="home-section home-benefits">
      <div className="home-container">
        <Heading
          eyebrow="More than looking the part"
          title="A website should work as hard as you do."
        >
          Your business needs a home you own, a story people understand, and an
          experience that helps them act.
        </Heading>
        <div className="home-benefit-grid">
          {benefits.map(({ title, text, icon: Icon, tag }, index) => (
            <article
              className={`home-benefit-card home-tone-${index % 3}`}
              key={title}
            >
              <span className="home-benefit-tag">
                Built for {tag.toLowerCase()}
              </span>
              <Icon size={25} aria-hidden="true" />
              <h3>{title}</h3>
              <p>{text}</p>
              <span className="home-benefit-signature">
                VEILCODE STUDIO <ArrowUpRight size={14} aria-hidden="true" />
              </span>
            </article>
          ))}
        </div>
        <div className="home-center-action">
          <Action href="/start">Let’s talk about your website</Action>
        </div>
      </div>
    </section>
  );
}

function LocalPresence() {
  return (
    <section className="home-section home-local">
      <div className="home-container">
        <Heading
          eyebrow="Rooted here. Ready for anywhere."
          title="Your web development partner in Kampala."
        >
          Local understanding, thoughtful collaboration, and a digital product
          built for the people who use it.
        </Heading>
        <div className="home-local-grid">
          <article className="home-notebook">
            <MapPin size={23} aria-hidden="true" />
            <h3>
              Built in Uganda.
              <br />
              Connected to the world.
            </h3>
            <p>
              We’re a founder-led studio in Kampala, working with businesses
              across Uganda and teams around the world.
            </p>
            <p>
              Whether you’re establishing your online presence, improving a
              product, or bringing a new idea to life, we keep the work personal
              and the process clear.
            </p>
            <h4>Close to your business</h4>
            <p>
              Direct conversations. Shared goals. Practical advice grounded in
              what your business actually needs.
            </p>
            <Link
              href="/locations/uganda"
              prefetch={false}
              className="home-text-link"
            >
              Explore our work in Uganda
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </article>
          <div className="home-local-right">
            <div className="home-world-card">
              <Globe2 size={160} strokeWidth={0.7} aria-hidden="true" />
              <span className="home-world-dot" aria-hidden="true" />
              <p>
                From Kampala,
                <br />
                <strong>with a wider perspective.</strong>
              </p>
            </div>
            <div className="home-contact-details">
              <span className="home-eyebrow">
                A real conversation starts here
              </span>
              <h3>Say hello to your next build.</h3>
              <a href="mailto:frank@veilcode.studio">
                frank@veilcode.studio
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
              <span>
                <MapPin size={15} aria-hidden="true" />
                Kampala, Uganda · Working worldwide
              </span>
            </div>
          </div>
        </div>
        <div className="home-project-banner">
          <div className="home-terminal" aria-hidden="true">
            <div>
              <span />
              <span />
              <span />
              <b>veilcode / studio</b>
            </div>
            <p>
              Good design.
              <br />
              Careful code.
              <br />
              <em>Your next chapter.</em>
            </p>
            <span>WEB · MOBILE · AI AUTOMATION</span>
          </div>
          <div>
            <span className="home-eyebrow">From idea to something real</span>
            <h2>
              Ready to start
              <br />
              your project?
            </h2>
            <p>
              Tell us where you want to go.
              <br />
              We’ll help you work out how to get there.
            </p>
            <Action href="/start">Let’s build it together</Action>
          </div>
        </div>
      </div>
    </section>
  );
}

function Technology() {
  const technologies = [
    "Next.js",
    "React",
    "TypeScript",
    "React Native",
    "PostgreSQL",
    "Node.js",
    "Python",
    "OpenAI",
  ];
  return (
    <section className="home-section home-technology">
      <div className="home-container">
        <Heading
          eyebrow="Solid foundations"
          title="Modern tools. Thoughtful choices."
        >
          We choose the right technology for your product, your team, and the
          road ahead.
        </Heading>
        <ul className="home-technology-grid">
          {technologies.map((technology, index) => (
            <li className={`home-tone-${index % 3}`} key={technology}>
              <Code2 size={21} aria-hidden="true" />
              <span>{technology}</span>
              <span className="home-technology-line" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Testimonials({ testimonials }: Pick<HomeProps, "testimonials">) {
  if (!testimonials.length)
    return (
      <section id="testimonials" className="home-section home-reviews">
        <div className="home-container">
          <Heading
            eyebrow="The studio behind the work"
            title="Small studio. Close collaboration."
          >
            You work directly with the engineer building your product, from the
            first conversation through launch and handover.
          </Heading>
          <div className="home-review-grid">
            {[
              {
                title: "A direct line",
                text: "Talk to the person doing the work. Fewer handoffs, clearer decisions, and a shared understanding of what comes next.",
              },
              {
                title: "Room for your ideas",
                text: "We bring our experience. You bring your understanding of the business. The best work happens when both have a voice.",
              },
              {
                title: "Care beyond launch",
                text: "Documentation, knowledge transfer, and a support window help you feel confident owning what we build together.",
              },
            ].map((item) => (
              <article className="home-review-card" key={item.title}>
                <h3 className="home-studio-note">{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <div className="home-center-action">
            <Action href="/about" secondary>
              Get to know the studio
            </Action>
          </div>
        </div>
      </section>
    );
  return (
    <section id="testimonials" className="home-section home-reviews">
      <div className="home-container">
        <div className="home-review-intro">
          <div>
            <span className="home-eyebrow">People, not just projects</span>
            <h2>
              Good relationships.
              <br />
              Even better work.
            </h2>
            <p>
              The best part of what we do is working with people who care about
              what they’re building. Here’s what they have to say.
            </p>
            <Link href="/about" prefetch={false} className="home-text-link">
              Meet the studio
              <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
          <div className="home-review-art" aria-hidden="true">
            <span>“</span>
            <p>
              A small studio.
              <br />
              <strong>A shared ambition.</strong>
            </p>
            <div className="home-review-orbits" />
          </div>
        </div>
        <div className="home-review-grid">
          {testimonials.slice(0, 6).map((item, index) => (
            <figure className="home-review-card" key={`${item.name}-${index}`}>
              <blockquote>“{item.quote}”</blockquote>
              <figcaption>
                {item.avatar ? (
                  <Image
                    src={item.avatar}
                    alt=""
                    width={44}
                    height={44}
                    sizes="44px"
                    loading="lazy"
                    className="home-review-avatar"
                  />
                ) : (
                  <span className="home-review-avatar" aria-hidden="true">
                    {item.initials}
                  </span>
                )}
                <span>
                  <strong>{item.name}</strong>
                  <span>{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section id="pricing" className="home-section home-pricing">
      <div className="home-container">
        <Heading
          eyebrow="Clarity before commitment"
          title="The right investment for your next step."
        >
          A focused first website or a more ambitious product. Start with a
          clear scope and a proposal built around your needs.
        </Heading>
        <div className="home-pricing-grid">
          {TIERS.map((tier) => (
            <article
              className={`home-price-card ${tier.featured ? "home-price-featured" : ""}`}
              key={tier.name}
            >
              {tier.badge ? (
                <span className="home-price-badge">{tier.badge}</span>
              ) : null}
              <span className="home-eyebrow">{tier.name}</span>
              <h3>
                {tier.name === "Starter"
                  ? "Start something good."
                  : tier.name === "Growth"
                    ? "Make your next move."
                    : "Think a little bigger."}
              </h3>
              <p>{tier.desc}</p>
              <div className="home-price">
                <strong>{tier.price.split(/\s[—-]\s/)[0]}</strong>
                <span>{tier.priceSub}</span>
              </div>
              <ul>
                {tier.features.map((feature) => (
                  <li key={feature}>
                    <Check size={16} aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Action href="/start" secondary={!tier.featured}>
                {tier.cta}
              </Action>
            </article>
          ))}
        </div>
        <div className="home-center-action">
          <Link
            href="/services#pricing"
            prefetch={false}
            className="home-text-link"
          >
            Compare services and packages
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function QuestionsAndContact() {
  return (
    <section id="contact" className="home-section home-questions">
      <div className="home-container home-questions-grid">
        <div className="home-faq">
          <span className="home-eyebrow">A little more clarity</span>
          <h2>
            Good questions.
            <br />
            Straight answers.
          </h2>
          <p>A few things you might be wondering before we start.</p>
          <div className="home-faq-list">
            {FAQS.slice(0, 7).map((faq) => (
              <details key={faq.q}>
                <summary>
                  {faq.q}
                  <span aria-hidden="true">+</span>
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
          <a href="mailto:frank@veilcode.studio" className="home-text-link">
            Something else on your mind?
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
        <HomeContactForm />
      </div>
    </section>
  );
}

function Insights({ posts }: Pick<HomeProps, "posts">) {
  if (!posts.length) return null;
  return (
    <section className="home-section home-insights">
      <div className="home-container">
        <Heading
          eyebrow="Notes from the studio"
          title="A little insight for your next big idea."
        >
          Practical thoughts on design, engineering, and building a business
          online.
        </Heading>
        <div className="home-insight-grid">
          {posts.map((post) => (
            <article className="home-insight-card" key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                prefetch={false}
                className="home-insight-image"
                aria-label={`${post.category}: read ${post.title}`}
              >
                {post.heroSrc ? (
                  <Image
                    src={post.heroSrc}
                    alt={post.heroAlt || post.title}
                    title={post.heroAlt || post.title}
                    fill
                    sizes="(max-width: 639px) calc(100vw - 40px), (max-width: 1023px) 46vw, (max-width: 1232px) 30vw, 380px"
                    loading="lazy"
                    className="home-cover-image"
                  />
                ) : (
                  <Layers3 size={48} aria-hidden="true" />
                )}
                <span>{post.category}</span>
              </Link>
              <div className="home-insight-copy">
                <time dateTime={post.publishedAt}>
                  {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: "Africa/Kampala",
                  })}
                </time>
                <h3>
                  <Link href={`/blog/${post.slug}`} prefetch={false}>
                    {post.title}
                  </Link>
                </h3>
                <p>{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  prefetch={false}
                  className="home-text-link"
                >
                  Read the article
                  <ArrowUpRight size={16} aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))}
        </div>
        <div className="home-center-action">
          <Action href="/blog" secondary>
            More from the studio
          </Action>
        </div>
      </div>
    </section>
  );
}

export function Homepage({
  services,
  projects,
  posts,
  testimonials,
}: HomeProps) {
  return (
    <div className="homepage">
      <Hero />
      {projects.length ? (
        <div className="home-trust-strip home-container">
          <p>Selected client work, studio products &amp; concepts</p>
          <div>
            {projects.map((project) => (
              <Link
                href={`/work/${project.slug}`}
                prefetch={false}
                key={project.slug}
              >
                {project.title}
                <ArrowUpRight size={15} aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      <Commitments />
      <Services services={services} />
      <Process />
      <div className="home-word-strip" aria-hidden="true">
        <span>Thoughtful design</span>
        <i>✦</i>
        <span>Careful engineering</span>
        <i>✦</i>
        <span>Meaningful results</span>
      </div>
      <FeaturedWork projects={projects} />
      <Portfolio projects={projects} />
      <Industries />
      <Benefits />
      <LocalPresence />
      <Technology />
      <Testimonials testimonials={testimonials} />
      <Pricing />
      <QuestionsAndContact />
      <Insights posts={posts} />
      <section className="home-closing">
        <div className="home-container">
          <span className="home-eyebrow">Your next chapter starts here</span>
          <h2>
            Let’s build something
            <br />
            that means business.
          </h2>
          <p>
            A thoughtful website. A better customer experience.
            <br />A digital home you’re proud to share.
          </p>
          <Action href="/start">Tell us about your project</Action>
          <span className="home-closing-note">
            Kampala, Uganda · Working with good people everywhere.
          </span>
        </div>
      </section>
    </div>
  );
}
