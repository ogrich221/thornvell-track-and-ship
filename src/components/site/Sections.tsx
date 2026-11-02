import { Link } from "@tanstack/react-router";
import { ArrowRight, Check, ClipboardList, Route as RouteIcon, Truck, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INDUSTRIES, SERVICES } from "@/lib/site";
import whyImg from "@/assets/why-terminal.jpg";
import ctaImg from "@/assets/cta-aircraft.jpg";
import { TrackingForm } from "./TrackingForm";

export function SectionHeading({ eyebrow, title, text, light, center }: { eyebrow: string; title: string; text?: string; light?: boolean; center?: boolean }) {
  return (
    <div className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className={`mt-4 text-3xl font-extrabold leading-tight md:text-5xl ${light ? "text-navy-foreground" : "text-navy-deep"}`}>{title}</h2>
      {text && <p className={`mt-5 text-lg leading-relaxed ${light ? "text-navy-foreground/70" : "text-muted-foreground"}`}>{text}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, text, img }: { eyebrow: string; title: string; text: string; img: string }) {
  return (
    <section className="relative isolate overflow-hidden bg-navy-deep pb-20 pt-40">
      <img src={img} alt="" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70" />
      <div className="absolute inset-0 -z-10 bg-hero-overlay" />
      <div className="container-x animate-fade-up">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-extrabold text-navy-foreground md:text-6xl">{title}</h1>
        <p className="mt-5 max-w-2xl text-lg text-navy-foreground/75">{text}</p>
      </div>
    </section>
  );
}

const VALUES = [
  { n: "01", t: "Reliability", d: "We prioritize dependable coordination, careful handling, and clear communication throughout the logistics process." },
  { n: "02", t: "Efficiency", d: "We focus on practical logistics solutions designed to simplify transportation, improve coordination, and support business operations." },
  { n: "03", t: "Global Perspective", d: "We approach logistics with an international mindset, helping businesses navigate complex transportation requirements." },
];

export function IntroSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <SectionHeading eyebrow="Who We Are" title="Logistics Built Around Your Business." />
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground lg:pt-10">
            <p>At Thornvell Logistics, we understand that every shipment represents more than cargo. It represents commitments, opportunities, and business relationships.</p>
            <p>Our approach combines professional coordination, reliable transportation solutions, and customer-focused logistics management to help businesses move goods confidently across markets.</p>
          </div>
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {VALUES.map((v) => (
            <article key={v.n} className="group rounded-2xl border border-border bg-card p-8 transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-elegant">
              <span className="font-display text-sm font-bold text-gold">{v.n}</span>
              <div className="my-5 h-px w-12 bg-gold transition-all duration-300 group-hover:w-20" />
              <h3 className="text-xl font-bold text-navy-deep">{v.t}</h3>
              <p className="mt-3 leading-relaxed text-muted-foreground">{v.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ServicesGrid({ heading = true }: { heading?: boolean }) {
  return (
    <section className="bg-secondary py-24 md:py-32">
      <div className="container-x">
        {heading && (
          <SectionHeading
            eyebrow="Our Services"
            title="Comprehensive Logistics Solutions."
            text="From individual shipments to complex business transportation requirements, discover logistics solutions designed to keep your operations moving."
          />
        )}
        <div className={`grid gap-7 md:grid-cols-2 lg:grid-cols-3 ${heading ? "mt-16" : ""}`}>
          {SERVICES.map((s, i) => (
            <article id={s.id} key={s.id} className="group scroll-mt-28 overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant">
              <div className="relative aspect-[4/3] overflow-hidden">
                <img src={s.img} alt={s.title} loading="lazy" width={1024} height={768} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute left-5 top-5 rounded-full bg-navy-deep/80 px-3 py-1 font-display text-xs font-bold text-gold backdrop-blur">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="p-7">
                <h3 className="text-xl font-bold text-navy-deep">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">{s.desc}</p>
                <Link to="/contact" search={{ type: "quote", service: s.title }} className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-navy transition-colors hover:text-gold">
                  Learn More <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const WHY = ["Customer-Focused Operations", "Professional Shipment Coordination", "Flexible Logistics Solutions", "Transparent Communication", "Cargo Handling Commitment", "Business-Oriented Service"];

export function WhySection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="relative">
          <img src={whyImg} alt="Container trucks at a freight terminal at dusk" loading="lazy" width={896} height={1152} className="aspect-[4/5] w-full rounded-2xl object-cover shadow-elegant" />
          <div className="absolute -bottom-6 -right-4 hidden rounded-xl bg-gold px-6 py-5 shadow-gold md:block">
            <p className="font-display text-sm font-bold uppercase tracking-widest text-navy-deep">Moving Business.</p>
            <p className="font-display text-sm font-bold uppercase tracking-widest text-navy-deep/70">Connecting the World.</p>
          </div>
        </div>
        <div>
          <SectionHeading
            eyebrow="Why Thornvell"
            title="Your Cargo. Our Commitment."
            text="Choosing the right logistics partner can make a meaningful difference to your business. Thornvell Logistics is committed to providing professional service, transparent communication, and carefully coordinated transportation solutions."
          />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {WHY.map((w) => (
              <li key={w} className="flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3.5 text-sm font-medium text-navy-deep">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/15"><Check className="h-3.5 w-3.5 text-gold" /></span>
                {w}
              </li>
            ))}
          </ul>
          <Button asChild variant="navy" size="xl" className="mt-10">
            <Link to="/contact">Partner With Us <ArrowRight /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function IndustriesGrid({ heading = true }: { heading?: boolean }) {
  return (
    <section className="bg-navy-deep py-24 md:py-32">
      <div className="container-x">
        {heading && <SectionHeading light eyebrow="Industries" title="Supporting Businesses Across Industries." />}
        <div className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-4 ${heading ? "mt-16" : ""}`}>
          {INDUSTRIES.map((ind) => (
            <article key={ind.title} className="group relative aspect-[4/5] overflow-hidden rounded-2xl">
              <img src={ind.img} alt={ind.title} loading="lazy" width={768} height={960} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-card-overlay" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="mb-3 h-px w-10 bg-gold transition-all duration-300 group-hover:w-16" />
                <h3 className="text-lg font-bold leading-snug text-navy-foreground">{ind.title}</h3>
                <p className="mt-2 max-h-0 overflow-hidden text-sm leading-relaxed text-navy-foreground/75 opacity-0 transition-all duration-500 group-hover:max-h-40 group-hover:opacity-100 group-focus-within:max-h-40 group-focus-within:opacity-100 max-lg:max-h-40 max-lg:opacity-100">
                  {ind.desc}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  { n: "01", t: "Request a Quote", d: "Tell us about your cargo, shipment requirements, destination, and preferred transportation method.", icon: ClipboardList },
  { n: "02", t: "Shipment Planning", d: "Our team reviews your requirements and prepares a suitable logistics arrangement.", icon: RouteIcon },
  { n: "03", t: "Cargo Movement", d: "Your shipment proceeds through the agreed transportation and handling arrangements.", icon: Truck },
  { n: "04", t: "Delivery & Confirmation", d: "Receive shipment updates and delivery confirmation through the available tracking and communication channels.", icon: PackageCheck },
];

export function ProcessSection() {
  return (
    <section className="py-24 md:py-32">
      <div className="container-x">
        <SectionHeading center eyebrow="How It Works" title="Simple Processes. Professional Execution." />
        <ol className="relative mt-16 grid gap-10 md:grid-cols-4 md:gap-6">
          <div aria-hidden className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-gradient-to-r from-gold/0 via-gold to-gold/0 md:block" />
          {STEPS.map((s) => (
            <li key={s.n} className="relative text-center">
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-card shadow-elegant">
                <s.icon className="h-6 w-6 text-navy" />
                <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-navy-deep font-display text-[0.65rem] font-bold text-gold">{s.n}</span>
              </div>
              <h3 className="mt-6 text-lg font-bold text-navy-deep">{s.t}</h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">{s.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function TrackingSection() {
  return (
    <section className="relative overflow-hidden bg-navy py-24 md:py-28">
      <div aria-hidden className="absolute -right-40 -top-40 h-96 w-96 rounded-full border border-gold/20" />
      <div aria-hidden className="absolute -right-20 -top-20 h-96 w-96 rounded-full border border-gold/10" />
      <div className="container-x relative grid items-center gap-12 lg:grid-cols-2">
        <SectionHeading
          light
          eyebrow="Shipment Tracking"
          title="Stay Informed. Every Step of the Way."
          text="Keep up with your shipment through our tracking service. Enter your tracking reference to access available shipment updates."
        />
        <TrackingForm inputId="track-section" placeholder="Enter your tracking number" buttonLabel="Track My Shipment" />
      </div>
    </section>
  );
}

const NETWORK = ["International Freight", "Cargo Transportation", "Import & Export Coordination", "Domestic Distribution", "Supply Chain Support"];

export function NetworkSection() {
  // Illustrative only — not real routes or offices.
  const nodes = [[180, 150], [330, 120], [470, 175], [600, 135], [720, 230], [270, 280], [520, 300]] as const;
  const arcs = [[0, 1], [1, 2], [2, 3], [3, 4], [1, 5], [2, 6], [6, 4], [0, 5]] as const;
  return (
    <section className="py-24 md:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <SectionHeading
            eyebrow="Global Network"
            title="Connecting Markets. Moving Opportunities."
            text="Modern logistics requires coordination across transportation networks, international markets, and supply-chain partners. Thornvell Logistics is positioned around delivering coordinated logistics solutions that help businesses move goods efficiently."
          />
          <ul className="mt-8 flex flex-wrap gap-2">
            {NETWORK.map((n) => (
              <li key={n} className="rounded-full border border-gold/40 bg-card px-4 py-2 text-sm font-medium text-navy-deep">{n}</li>
            ))}
          </ul>
        </div>
        <div className="relative overflow-hidden rounded-2xl bg-navy-deep p-6 shadow-elegant lg:col-span-3">
          <svg viewBox="0 0 900 420" className="w-full" role="img" aria-label="Illustrative world map with connection lines">
            <defs>
              <pattern id="dots" width="12" height="12" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.4" className="fill-navy-foreground/15" />
              </pattern>
            </defs>
            <g fill="url(#dots)">
              <path d="M90 90 Q160 50 260 70 L300 130 Q260 200 220 230 Q200 300 240 360 L200 380 Q150 300 160 230 Q100 180 90 90Z" />
              <path d="M400 80 Q470 60 520 90 L500 140 Q560 160 540 230 Q520 330 470 360 Q440 290 430 220 Q380 190 400 80Z" />
              <path d="M540 70 Q680 40 800 90 Q820 160 760 190 Q720 260 660 230 Q600 200 560 160Z" />
              <path d="M700 290 Q780 280 810 320 Q780 360 720 350Z" />
            </g>
            {arcs.map(([a, b], i) => {
              const [x1, y1] = nodes[a]; const [x2, y2] = nodes[b];
              const mx = (x1 + x2) / 2; const my = Math.min(y1, y2) - 50;
              return <path key={i} d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} fill="none" className="stroke-gold/70 animate-dash" strokeWidth="1.4" strokeDasharray="4 6" />;
            })}
            {nodes.map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="10" className="fill-gold/15" />
                <circle cx={x} cy={y} r="4" className="fill-gold" />
              </g>
            ))}
          </svg>
          <p className="mt-2 text-right text-xs text-navy-foreground/40">Illustrative map</p>
        </div>
      </div>
    </section>
  );
}

export function CtaSection() {
  return (
    <section className="relative isolate overflow-hidden py-28 md:py-36">
      <img src={ctaImg} alt="" loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className="absolute inset-0 -z-10 bg-navy-deep/80" />
      <div className="container-x text-center">
        <div className="mx-auto mb-8 h-px w-20 bg-gold" />
        <h2 className="mx-auto max-w-4xl text-3xl font-extrabold uppercase tracking-tight text-navy-foreground md:text-5xl">
          Ready to Move Your Business <span className="text-gold">Forward?</span>
        </h2>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-navy-foreground/75">
          Whether you're shipping a single consignment or managing ongoing business transportation requirements, Thornvell Logistics is ready to discuss a solution that works for you.
        </p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild variant="gold" size="xl"><Link to="/contact" search={{ type: "quote" }}>Request a Shipping Quote</Link></Button>
          <Button asChild variant="glass" size="xl"><Link to="/contact">Contact Our Team</Link></Button>
        </div>
      </div>
    </section>
  );
}
