import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import img from "@/assets/cta-aircraft.jpg";
import { ContactDetails } from "@/components/site/ContactDetails";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { PageHero, SectionHeading } from "@/components/site/Sections";

const searchSchema = z.object({
  type: z.enum(["quote", "contact"]).optional().catch(undefined),
  service: z.string().max(120).optional().catch(undefined),
});

export const Route = createFileRoute("/contact")({
  staticData: { sitemap: true },
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "Contact & Request a Quote — Thornvell Logistics" },
      { name: "description", content: "Request a shipping quote or contact the Thornvell Logistics team about freight, transportation and warehousing." },
      { property: "og:title", content: "Contact Thornvell Logistics" },
      { property: "og:description", content: "Let's move something forward." },
    ],
  }),
  component: Contact,
});

const FAQ = [
  { q: "How do I request a quote?", a: "Complete the enquiry form with your cargo details, origin, destination and preferred service. Our team will review it and respond." },
  { q: "Where do I find my tracking reference?", a: "Your tracking reference is provided by our team once your shipment is registered. Enter it on the Track Shipment page." },
  { q: "Can you handle one-off shipments as well as ongoing business?", a: "Yes — tell us about your requirements and we'll discuss an arrangement that suits a single consignment or a recurring schedule." },
];

function Contact() {
  const { type, service } = Route.useSearch();
  const isQuote = type === "quote";
  return (
    <>
      <PageHero
        eyebrow={isQuote ? "Request a Quote" : "Contact"}
        title={isQuote ? "Request a Shipping Quote." : "Let's Move Something Forward."}
        text="Have a shipment to arrange, a logistics question, or a business partnership proposal? Our team would be pleased to hear from you."
        img={img}
      />
      <section className="py-24">
        <div className="container-x grid gap-14 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <SectionHeading eyebrow="Get in touch" title="Talk to our team." />
            <div className="mt-10"><ContactDetails /></div>
          </div>
          <div className="lg:col-span-3"><EnquiryForm key={`${type}-${service}`} kind={isQuote ? "quote" : "contact"} defaultService={service ?? ""} /></div>
        </div>
      </section>
      <section id="faq" className="scroll-mt-24 bg-secondary py-24">
        <div className="container-x max-w-3xl">
          <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions." />
          <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-card">
            {FAQ.map((f) => (
              <details key={f.q} className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between font-display font-bold text-navy-deep">
                  {f.q}<span className="text-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
