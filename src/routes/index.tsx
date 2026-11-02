import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-port.jpg";
import { TrackingForm } from "@/components/site/TrackingForm";
import {
  CtaSection,
  IndustriesGrid,
  IntroSection,
  NetworkSection,
  ProcessSection,
  ServicesGrid,
  TrackingSection,
  WhySection,
} from "@/components/site/Sections";
import { ContactDetails } from "@/components/site/ContactDetails";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { SectionHeading } from "@/components/site/Sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Thornvell Logistics — Global Logistics. Without Limits." },
      { name: "description", content: "Freight forwarding, air, sea and road freight, warehousing and courier coordination. Request a quote or track your shipment with Thornvell Logistics." },
      { property: "og:title", content: "Thornvell Logistics — Global Logistics. Without Limits." },
      { property: "og:description", content: "Dependable logistics, intelligent freight solutions and seamless cargo transportation." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative isolate flex min-h-[100svh] items-center overflow-hidden bg-navy-deep pb-16 pt-28">
        <img src={heroImg} alt="Container vessel at a commercial seaport at dusk" width={1920} height={1088} fetchPriority="high" className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-hero-overlay" />
        <div className="container-x grid items-end gap-12 lg:grid-cols-12">
          <div className="animate-fade-up lg:col-span-7">
            <p className="eyebrow">Moving Business. Connecting the World.</p>
            <h1 className="mt-6 text-5xl font-extrabold leading-[1.02] text-navy-foreground md:text-7xl">
              GLOBAL LOGISTICS.
              <br />
              <span className="text-gold">WITHOUT LIMITS.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-navy-foreground/80">
              Connecting businesses, markets, and opportunities through dependable logistics, intelligent freight solutions, and seamless cargo transportation. Thornvell Logistics delivers the confidence and coordination your supply chain deserves.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild variant="gold" size="xl"><Link to="/contact" search={{ type: "quote" }}>Request a Quote <ArrowRight /></Link></Button>
              <Button asChild variant="glass" size="xl"><Link to="/services">Explore Our Services</Link></Button>
            </div>
          </div>
          <div className="animate-fade-up lg:col-span-5 [animation-delay:200ms]">
            <div className="rounded-2xl border border-navy-foreground/15 bg-navy-deep/60 p-6 backdrop-blur-md md:p-8">
              <h2 className="text-xl font-bold text-navy-foreground">Track Your Shipment</h2>
              <p className="mb-5 mt-1 text-sm text-navy-foreground/60">Enter the reference provided by our team.</p>
              <TrackingForm compact inputId="track-hero" placeholder="Enter your tracking reference" buttonLabel="Track Shipment" />
            </div>
          </div>
        </div>
        <a href="#intro" aria-label="Scroll to content" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block">
          <span className="flex h-11 w-7 justify-center rounded-full border-2 border-navy-foreground/40 pt-2">
            <span className="h-2 w-1 rounded-full bg-gold animate-scroll-dot" />
          </span>
        </a>
      </section>
      <div id="intro" className="scroll-mt-20"><IntroSection /></div>
      <ServicesGrid />
      <WhySection />
      <IndustriesGrid />
      <ProcessSection />
      <TrackingSection />
      <NetworkSection />
      <CtaSection />
      <section className="py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow="Contact" title="Let's Move Something Forward." text="Have a shipment to arrange, a logistics question, or a business partnership proposal? Our team would be pleased to hear from you." />
            <div className="mt-10"><ContactDetails /></div>
          </div>
          <div className="lg:col-span-3"><EnquiryForm kind="contact" /></div>
        </div>
      </section>
    </>
  );
}
