import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { AlertCircle, CheckCircle2, Info, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trackingRefSchema } from "@/lib/enquiry-schema";
import { trackShipment, type TrackingResult } from "@/lib/tracking.functions";
import { cn } from "@/lib/utils";

type Props = { placeholder: string; buttonLabel: string; compact?: boolean; inputId: string };

export function TrackingForm({ placeholder, buttonLabel, compact, inputId }: Props) {
  const track = useServerFn(trackShipment);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackingResult | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setResult(null);
    const parsed = trackingRefSchema.safeParse(value);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please enter a valid tracking reference");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      setResult(await track({ data: { reference: parsed.data } }));
    } catch {
      setError("Tracking is temporarily unavailable. Please try again or contact our team.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={onSubmit} noValidate className={cn("flex flex-col gap-3", !compact && "sm:flex-row")}>
        <label htmlFor={inputId} className="sr-only">Tracking reference</label>
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id={inputId}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            autoComplete="off"
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-err` : undefined}
            className="h-13 w-full rounded-lg border border-input bg-card pl-11 pr-4 text-sm text-foreground outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30"
          />
        </div>
        <Button type="submit" variant="gold" size="xl" disabled={loading}>
          {loading && <Loader2 className="animate-spin" />}
          {buttonLabel}
        </Button>
      </form>
      <div aria-live="polite" className="mt-3">
        {error && (
          <p id={`${inputId}-err`} className="flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
          </p>
        )}
        {result && <TrackingResultView result={result} />}
      </div>
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gold/40 bg-card p-4 text-sm text-card-foreground">
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
      <div>{children}</div>
    </div>
  );
}

function TrackingResultView({ result }: { result: TrackingResult }) {
  if (result.status === "not_configured")
    return (
      <Notice>
        Online tracking is being set up. For shipment updates, please{" "}
        <Link to="/contact" className="font-semibold text-navy underline underline-offset-2">contact our team</Link>{" "}
        with your reference.
      </Notice>
    );
  if (result.status === "not_found")
    return (
      <Notice>
        We couldn't find a shipment with reference <strong>{result.reference}</strong>. Check the reference and try again, or{" "}
        <Link to="/contact" className="font-semibold text-navy underline underline-offset-2">contact us</Link>.
      </Notice>
    );

  const { shipment, events } = result;
  return (
    <div className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-elegant">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Reference</p>
          <p className="font-display text-lg font-bold">{shipment.reference}</p>
          {(shipment.origin || shipment.destination) && (
            <p className="text-sm text-muted-foreground">{shipment.origin ?? "—"} → {shipment.destination ?? "—"}</p>
          )}
        </div>
        <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-navy">{shipment.currentStatus}</span>
      </div>
      {events.length === 0 ? (
        <p className="pt-4 text-sm text-muted-foreground">No detailed updates have been recorded yet.</p>
      ) : (
        <ol className="relative mt-5 space-y-5 border-l border-border pl-6">
          {events.map((e, i) => (
            <li key={i} className="relative">
              <span className={cn("absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full", i === 0 ? "bg-gold" : "bg-silver")}>
                {i === 0 && <CheckCircle2 className="h-3 w-3 text-navy-deep" />}
              </span>
              <p className="font-semibold">{e.status}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(e.occurredAt).toLocaleString()} {e.location && `· ${e.location}`}
              </p>
              {e.note && <p className="mt-1 text-sm text-muted-foreground">{e.note}</p>}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
