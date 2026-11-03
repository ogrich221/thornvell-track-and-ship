import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Building2, Headphones, Home, LayoutDashboard, Package, FileText, Plus, UserRound, Users, ChartNoAxesCombined, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/site/Logo";
import { NavArrows } from "@/components/site/NavArrows";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect x="1" y="1" width="38" height="38" rx="9" className="fill-navy stroke-gold" strokeWidth="1.5" />
      <path d="M10 13h20M20 13v15" className="stroke-gold" strokeWidth="3" strokeLinecap="round" />
      <path d="M12 27c4 0 6-3 8-3s4 3 8 3" className="stroke-navy-foreground" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** Dark navy stage with drifting gold light, a large rotating logo emblem and frosted-glass content. */
export function DashboardShell({ eyebrow, title, intro, actions, navigation, children }: { eyebrow: string; title: string; intro?: string; actions?: ReactNode; navigation?: ReactNode; children: ReactNode }) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-navy-deep pb-12 text-navy-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-24 opacity-[0.07] sm:-right-20">
          <div className="animate-slow-spin"><LogoMark className="h-[34rem] w-[34rem]" /></div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,color-mix(in_oklab,var(--navy-foreground)_8%,transparent)_1px,transparent_0)] [background-size:28px_28px]" />
      </div>
      <header className="border-b border-navy-foreground/10 bg-navy-deep/80">
        <div className="container-x flex min-h-20 flex-wrap items-center justify-between gap-3 py-4">
          <Logo light />
          <div className="flex items-center gap-3"><NavArrows /><Button asChild variant="glass" size="sm"><Link to="/"><Home className="h-4 w-4" /><span className="hidden sm:inline">Website</span></Link></Button></div>
        </div>
      </header>
      <div className="container-x">
        <div className="grid gap-5 border-b border-navy-foreground/10 py-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="min-w-0">
            <p className="eyebrow">{eyebrow}</p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{title}</h1>
            {intro && <p className="mt-2 max-w-2xl text-sm text-navy-foreground/70 sm:text-base">{intro}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-2 md:justify-end">{actions}</div>}
        </div>
        <div className={cn("mt-6", navigation && "grid items-start gap-6 lg:grid-cols-[220px_minmax(0,1fr)]")}>
          {navigation && <aside className="min-w-0 lg:sticky lg:top-6">{navigation}<div className="hidden border-t border-navy-foreground/10 px-4 pt-5 lg:block"><LogoMark className="mb-3 h-10 w-10" /><p className="text-xs font-semibold text-gold">THORNVELL LOGISTICS</p><p className="mt-1 text-xs text-navy-foreground/50">Moving business forward.</p></div></aside>}
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function GlassCard({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("glass rounded-lg p-5 sm:p-6", className)}>{children}</div>;
}

export function Stat({ label, value }: { label: string; value: ReactNode }) {
  return (
    <GlassCard className="p-4 sm:p-5">
      <p className="text-xs uppercase tracking-widest text-navy-foreground/60">{label}</p>
      <p className="mt-2 font-display text-2xl font-extrabold text-gold sm:text-3xl">{value}</p>
    </GlassCard>
  );
}

export const glassField = "glass-input w-full rounded-lg px-3 py-2.5 text-sm outline-none transition placeholder:text-navy-foreground/40 focus:border-gold focus:ring-2 focus:ring-gold/30 [&>option]:bg-navy-deep";

export function TabBar<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string }[]; value: T; onChange: (t: T) => void }) {
  const icons: Record<string, typeof Home> = { overview: LayoutDashboard, shipments: Package, quotes: FileText, "new-quote": Plus, profile: UserRound, support: Headphones, customers: Users, reports: ChartNoAxesCombined, signin: UserRound, register: Plus };
  const dashboard = tabs.some((t) => t.id === "overview");
  return (
    <div className={cn("glass mb-5 flex gap-1 overflow-x-auto rounded-lg p-1", dashboard && "lg:flex-col lg:overflow-visible lg:bg-transparent lg:border-transparent")} role="tablist">
      {tabs.map((t) => { const Icon = icons[t.id] ?? Building2; return (
        <Button
          key={t.id}
          variant="ghost"
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cn("h-11 shrink-0 justify-start rounded-md px-3 text-sm font-medium transition", dashboard && "lg:w-full", value === t.id ? "bg-gold text-navy-deep hover:bg-gold-soft hover:text-navy-deep" : "text-navy-foreground/75 hover:bg-navy-foreground/10 hover:text-navy-foreground")}
        >
          <Icon className="h-4 w-4" />{t.label}
          {dashboard && value === t.id && <ArrowUpRight className="ml-auto hidden h-4 w-4 lg:block" />}
        </Button>
      ); })}
    </div>
  );
}
