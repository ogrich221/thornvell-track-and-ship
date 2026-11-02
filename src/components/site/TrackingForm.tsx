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

  return <ShipmentCard shipment={result.shipment} events={result.events} />;
}

type CardShipment = Extract<TrackingResult, { status: "found" }>["shipment"];
type CardEvent = Extract<TrackingResult, { status: "found" }>["events"][number];

export function ShipmentCard({ shipment, events }: { shipment: CardShipment; events: CardEvent[] }) {
  const current = statusIndex(shipment.currentStatus);
  const facts = [
    ["Origin", shipment.origin],
    ["Destination", shipment.destination],
    ["Dispatch date", fmtDate(shipment.dispatchDate)],
    ["Estimated delivery", fmtDate(shipment.estimatedDelivery)],
    ["Current location", shipment.currentLocation],
  ].filter((f): f is [string, string] => !!f[1]);

  return (
    <div className="rounded-xl border border-border bg-card p-5 text-card-foreground shadow-elegant sm:p-6">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 border-b border-border pb-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Tracking reference</p>
          <p className="truncate font-display text-lg font-bold">{shipment.reference}</p>
        </div>
        <span className="shrink-0 rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-navy">{shipment.currentStatus}</span>
      </div>

      {facts.length > 0 && (
        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 border-b border-border py-4 text-sm sm:grid-cols-3">
          {facts.map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="text-xs text-muted-foreground">{k}</dt>
              <dd className="truncate font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* Progress stepper: horizontal on larger screens, vertical on phones */}
      <ol className="my-5 grid gap-3 sm:grid-cols-7 sm:gap-1">
        {SHIPMENT_STATUSES.map((s, i) => {
          const done = current >= 0 && i <= current;
          return (
            <li key={s} className="flex items-center gap-3 sm:flex-col sm:gap-2 sm:text-center">
              <span className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-[10px] font-bold", done ? "border-gold bg-gold text-navy-deep" : "border-border text-muted-foreground")}>
                {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <span className={cn("text-xs leading-tight", done ? "font-semibold text-foreground" : "text-muted-foreground")}>{s}</span>
            </li>
          );
        })}
      </ol>

      <h4 className="text-sm font-semibold">Verified updates</h4>
      {events.length === 0 ? (
        <p className="pt-2 text-sm text-muted-foreground">No detailed updates have been recorded yet.</p>
      ) : (
        <ol className="relative mt-4 space-y-5 border-l border-border pl-6">
          {events.map((e, i) => (
            <li key={i} className="relative">
              <span className={cn("absolute -left-[31px] top-0.5 h-4 w-4 rounded-full", i === 0 ? "bg-gold" : "bg-silver")} />
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
