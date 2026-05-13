import { CTA } from "@/components/shared/CTA";
import { Hero } from "@/components/shared/Hero";
import { Marquee } from "@/components/shared/Marquee";
import { Process } from "@/components/shared/Process";
import { Services } from "@/components/shared/Services";
import { TechStack } from "@/components/shared/TechStack";
import { Testimonials } from "@/components/shared/Testimonials";
import { Work } from "@/components/shared/Work";
import { getPublishedProjects, getPublishedServices } from "@/queries";

export default async function Home() {

  const [services, projects] = await Promise.all([
    getPublishedServices(),
    getPublishedProjects(),
  ]);

  return (
    <>
      <Hero />
      <Marquee />
      <Services services={services} />
      <Process />
      <Work projects={projects} />
      <TechStack />
      <Testimonials />
      <CTA />
    </>
  )
}
