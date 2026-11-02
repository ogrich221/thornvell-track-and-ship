import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link to="/" className={cn("group flex items-center gap-3", className)} aria-label="Thornvell Logistics home">
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true">
        <rect x="1" y="1" width="38" height="38" rx="9" className="fill-navy stroke-gold" strokeWidth="1.5" />
        <path d="M10 13h20M20 13v15" className="stroke-gold" strokeWidth="3" strokeLinecap="round" />
        <path d="M12 27c4 0 6-3 8-3s4 3 8 3" className="stroke-navy-foreground" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      </svg>
      <span className="leading-none">
        <span className={cn("block font-display text-lg font-extrabold tracking-[0.18em]", light ? "text-navy-foreground" : "text-navy-deep")}>
          THORNVELL
        </span>
        <span className="mt-1 block font-display text-[0.6rem] font-semibold tracking-[0.42em] text-gold">LOGISTICS</span>
      </span>
    </Link>
  );
}
