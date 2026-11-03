import { createFileRoute } from "@tanstack/react-router";
import img from "@/assets/svc-forwarding.jpg";
import { CtaSection, IntroSection, NetworkSection, PageHero, ProcessSection, WhySection } from "@/components/site/Sections";

export const Route = createFileRoute("/about")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "About Us — Thornvell Logistics" },
      { name: "description", content: "Learn how Thornvell Logistics approaches freight, transportation and supply-chain coordination with reliability, efficiency and a global perspective." },
      { property: "og:title", content: "About Thornvell Logistics" },
      { property: "og:description", content: "Logistics built around your business." },
    ],
  }),
  component: () => (
    <>
      <PageHero eyebrow="About Us" title="A dependable partner for moving goods." text="Professional coordination, reliable transportation solutions, and customer-focused logistics management." img={img} />
      <IntroSection />
      <WhySection />
      <ProcessSection />
      <NetworkSection />
      <CtaSection />
    </>
  ),
});
