import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { Menu, Phone, UserRound, X } from "lucide-react";
import { useSession } from "@/hooks/use-session";
import { Button } from "@/components/ui/button";
import { CONTACT, NAV } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { LanguageSelect } from "./LanguageSelect";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { user } = useSession();
  const portalLabel = user ? "My Portal" : "Customer Login";
  const overHero = (pathname === "/" || pathname === "/portal" || pathname === "/admin" || pathname === "/auth") && !scrolled && !open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        overHero ? "bg-transparent" : "border-b border-navy-foreground/10 bg-navy-deep/95 shadow-elegant backdrop-blur",
      )}
    >
      <div className="container-x flex h-20 items-center justify-between gap-3 lg:gap-6">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <LanguageSelect />
          <Logo light />
        </div>
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="relative whitespace-nowrap px-2.5 py-2 text-sm font-medium text-navy-foreground/80 transition-colors hover:text-navy-foreground data-[status=active]:text-gold"
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          <Link to="/contact" className="hidden items-center gap-2 whitespace-nowrap text-sm xl:flex font-medium text-navy-foreground/80 hover:text-gold">
            <Phone className="h-4 w-4 text-gold" />
            {CONTACT.phone || "Contact us"}
          </Link>
          <Link to={user ? "/portal" : "/auth"} className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-navy-foreground/80 hover:text-gold">
            <UserRound className="h-4 w-4 text-gold" />{portalLabel}
          </Link>
          <Button asChild variant="gold">
            <Link to="/contact" search={{ type: "quote" }}>Get a Quote</Link>
          </Button>
        </div>
        <button
          type="button"
          className="shrink-0 rounded-md p-2 text-navy-foreground lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      <div
        id="mobile-nav"
        className={cn(
          "grid overflow-hidden bg-navy-deep transition-all duration-300 lg:hidden",
          open ? "grid-rows-[1fr] border-t border-navy-foreground/10" : "grid-rows-[0fr]",
        )}
      >
        <nav aria-label="Mobile" className="min-h-0">
          <div className="container-x flex flex-col gap-1 py-6">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                tabIndex={open ? 0 : -1}
                className="rounded-lg px-3 py-3 font-display text-lg font-semibold text-navy-foreground/85 hover:bg-navy data-[status=active]:text-gold"
              >
                {n.label}
              </Link>
            ))}
            <Link to={user ? "/portal" : "/auth"} tabIndex={open ? 0 : -1} className="flex items-center gap-2 rounded-lg px-3 py-3 font-display text-lg font-semibold text-gold hover:bg-navy">
              <UserRound className="h-5 w-5" />{portalLabel}
            </Link>
            <Button asChild variant="gold" size="xl" className="mt-4">
              <Link to="/contact" search={{ type: "quote" }} tabIndex={open ? 0 : -1}>Get a Quote</Link>
            </Button>
          </div>
        </nav>
      </div>
    </header>
  );
}
