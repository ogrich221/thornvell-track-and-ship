import { createFileRoute } from "@tanstack/react-router";
import img from "@/assets/svc-sea.jpg";
import { CtaSection, PageHero, ProcessSection, ServicesGrid } from "@/components/site/Sections";

export const Route = createFileRoute("/services")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Logistics Services — Thornvell Logistics" },
      { name: "description", content: "Freight forwarding, air freight, sea freight, road transportation, warehousing & distribution, and courier & express delivery." },
      { property: "og:title", content: "Logistics Services — Thornvell Logistics" },
      { property: "og:description", content: "Comprehensive logistics solutions to keep your operations moving." },
    ],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Our Services" title="Comprehensive Logistics Solutions." text="From individual shipments to complex business transportation requirements, discover logistics solutions designed to keep your operations moving." img={img} />
      <ServicesGrid heading={false} />
      <ProcessSection />
      <CtaSection />
    </>
  ),
});
