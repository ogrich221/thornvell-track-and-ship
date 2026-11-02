import { Link } from "@tanstack/react-router";
import { CONTACT, NAV, SERVICES, SOCIAL } from "@/lib/site";
import { Logo } from "./Logo";

const linkCls = "text-sm text-navy-foreground/65 transition-colors hover:text-gold";

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-navy-foreground">
      <div className="container-x grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo light />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-navy-foreground/65">
            Thornvell Logistics is a logistics and transportation brand committed to dependable cargo coordination,
            professional freight solutions, and customer-focused service.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social media">
            {SOCIAL.map((s) =>
              s.href ? (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="rounded-full border border-navy-foreground/20 px-3 py-1.5 text-xs hover:border-gold hover:text-gold">
                    {s.label}
                  </a>
                </li>
              ) : (
                <li key={s.label} className="rounded-full border border-navy-foreground/10 px-3 py-1.5 text-xs text-navy-foreground/40" title="Profile link coming soon">
                  {s.label}
                </li>
              ),
            )}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow">Quick Links</h3>
          <ul className="mt-5 space-y-3">
            {NAV.map((n) => (
              <li key={n.to}><Link to={n.to} className={linkCls}>{n.label === "Contact" ? "Contact Us" : n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow">Our Services</h3>
          <ul className="mt-5 space-y-3">
            {SERVICES.map((s) => (
              <li key={s.id}><Link to="/services" hash={s.id} className={linkCls}>{s.short}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="eyebrow">Customer Support</h3>
          <ul className="mt-5 space-y-3">
            <li><Link to="/contact" search={{ type: "quote" }} className={linkCls}>Request a Quote</Link></li>
            <li><Link to="/track" className={linkCls}>Track Shipment</Link></li>
            <li><Link to="/contact" hash="faq" className={linkCls}>Frequently Asked Questions</Link></li>
            <li><Link to="/contact" className={linkCls}>Contact Support</Link></li>
          </ul>
          {CONTACT.email && <p className="mt-6 text-sm text-navy-foreground/65">{CONTACT.email}</p>}
        </div>
      </div>
      <div className="border-t border-navy-foreground/10">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-6 text-xs text-navy-foreground/50 md:flex-row">
          <p>© 2026 Thornvell Logistics. All Rights Reserved.</p>
          <ul className="flex gap-6">
            <li><Link to="/legal/$page" params={{ page: "privacy" }} className="hover:text-gold">Privacy Policy</Link></li>
            <li><Link to="/legal/$page" params={{ page: "terms" }} className="hover:text-gold">Terms & Conditions</Link></li>
            <li><Link to="/legal/$page" params={{ page: "cookies" }} className="hover:text-gold">Cookie Policy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
