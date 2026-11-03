import { createFileRoute } from "@tanstack/react-router";
import img from "@/assets/svc-road.jpg";
import { PageHero, ProcessSection, TrackingSection } from "@/components/site/Sections";

export const Route = createFileRoute("/track")({
  staticData: { sitemap: true },
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Track Shipment — Thornvell Logistics" },
      { name: "description", content: "Enter your Thornvell Logistics tracking reference to view available shipment updates." },
      { property: "og:title", content: "Track Your Shipment — Thornvell Logistics" },
      { property: "og:description", content: "Stay informed, every step of the way." },
    ],
  }),
  component: () => (
    <>
      <PageHero eyebrow="Track Shipment" title="Track Your Shipment." text="Use the reference provided by our team to view the latest available updates." img={img} />
      <TrackingSection />
      <ProcessSection />
    </>
  ),
});
