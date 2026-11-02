import { createFileRoute } from "@tanstack/react-router";
import img from "@/assets/ind-construction.jpg";
import { CtaSection, IndustriesGrid, PageHero } from "@/components/site/Sections";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries We Serve — Thornvell Logistics" },
      { name: "description", content: "Logistics support for manufacturing, oil & gas, construction, agriculture, retail & e-commerce, automotive, healthcare supplies and consumer goods." },
      { property: "og:title", content: "Industries We Serve — Thornvell Logistics" },
      { property: "og:description", content: "Supporting businesses across industries." },
    ],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Industries" title="Supporting Businesses Across Industries." text="Every sector moves differently. We plan around the cargo, timing and handling requirements of your business." img={img} />
      <IndustriesGrid heading={false} />
      <CtaSection />
    </>
  ),
});
