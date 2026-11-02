import type { ReactNode } from "react";
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
export function DashboardShell({ eyebrow, title, intro, actions, children }: { eyebrow: string; title: string; intro?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-navy-deep pb-20 pt-28 text-navy-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-drift absolute -left-32 top-10 h-96 w-96 rounded-full bg-gold/20 blur-3xl" />
        <div className="animate-drift absolute -right-24 top-1/3 h-[28rem] w-[28rem] rounded-full bg-navy blur-3xl [animation-delay:-6s]" />
        <div className="animate-drift absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-gold/10 blur-3xl [animation-delay:-12s]" />
        <div className="absolute -right-40 -top-24 opacity-[0.07] sm:-right-20">
          <div className="animate-slow-spin"><LogoMark className="h-[34rem] w-[34rem]" /></div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,color-mix(in_oklab,var(--navy-foreground)_8%,transparent)_1px,transparent_0)] [background-size:28px_28px]" />
      </div>
      <div className="container-x">
        <div className="glass grid gap-6 rounded-3xl p-6 sm:p-8 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
          <div className="relative mx-auto h-20 w-20 shrink-0 md:mx-0">
            <div className="absolute inset-0 rounded-2xl bg-gold/30 blur-xl" />
            <LogoMark className="relative h-20 w-20 drop-shadow-xl" />
          </div>
          <div className="min-w-0 text-center md:text-left">
            <p className="eyebrow justify-center md:justify-start">{eyebrow}</p>
            <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{title}</h1>
            {intro && <p className="mt-2 max-w-2xl text-sm text-navy-foreground/70 sm:text-base">{intro}</p>}
          </div>
          {actions && <div className="flex flex-wrap justify-center gap-2 md:justify-end">{actions}</div>}
        </div>
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}

export function GlassCard({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("glass rounded-2xl p-5 sm:p-6", className)}>{children}</div>;
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
  return (
    <div className="glass -mx-1 mb-6 flex gap-1 overflow-x-auto rounded-xl p-1" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={cn("shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition", value === t.id ? "bg-gold text-navy-deep" : "text-navy-foreground/75 hover:bg-navy-foreground/10")}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
