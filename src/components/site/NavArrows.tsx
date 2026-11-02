import { useRouter } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function NavArrows() {
  const router = useRouter();
  const btn = "flex h-9 w-9 items-center justify-center rounded-full border border-navy-foreground/20 text-navy-foreground/80 transition-colors hover:border-gold hover:text-gold";
  return (
    <div className="flex shrink-0 items-center gap-1">
      <button type="button" aria-label="Go back" title="Back" onClick={() => router.history.back()} className={btn}>
        <ChevronLeft className="h-4 w-4" />
      </button>
      <button type="button" aria-label="Go forward" title="Forward" onClick={() => router.history.forward()} className={btn}>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
