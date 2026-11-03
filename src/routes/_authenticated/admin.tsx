import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Plus, ShieldAlert, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DashboardShell, GlassCard, glassField, Stat, TabBar } from "@/components/portal/DashboardShell";
import { addShipmentEvent, createShipment, getAdminOverview, getShipmentEvents, updateCustomer, updateQuote, updateShipment } from "@/lib/admin.functions";
import { fmtDate, QUOTE_STATUSES, SHIPMENT_STATUSES } from "@/lib/platform";
import { SERVICE_OPTIONS } from "@/lib/site";

export const Route = createFileRoute("/_authenticated/admin")({
  staticData: { sitemap: false },
  head: () => ({
    meta: [
      { title: "Operations Dashboard — Thornvell Logistics" },
      { name: "description", content: "Staff dashboard for shipments, customers, quotes and tracking updates." },
      { property: "og:title", content: "Operations Dashboard — Thornvell Logistics" },
      { property: "og:description", content: "Thornvell Logistics staff dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Tab = "overview" | "shipments" | "quotes" | "customers" | "reports";
type Overview = Awaited<ReturnType<typeof getAdminOverview>>;

function Admin() {
  const fetchOverview = useServerFn(getAdminOverview);
  const [tab, setTab] = useState<Tab>("overview");
  const { data, isLoading, error } = useQuery({ queryKey: ["admin"], queryFn: () => fetchOverview(), retry: false });

  if (error)
    return (
      <DashboardShell eyebrow="Restricted" title="Staff access only">
        <GlassCard className="mx-auto flex max-w-md flex-col items-center text-center">
          <ShieldAlert className="h-10 w-10 text-gold" />
          <p className="mt-3 text-navy-foreground/75">This area is reserved for authorised Thornvell Logistics staff.</p>
          <Button asChild variant="gold" className="mt-5"><Link to="/portal">Go to my dashboard</Link></Button>
        </GlassCard>
      </DashboardShell>
    );

  return (
    <DashboardShell
      eyebrow="Operations Control"
      title="Thornvell Operations Dashboard"
      intro="Register shipments, publish verified tracking updates, and respond to customer quote requests."
      actions={<Button asChild variant="glass"><Link to="/portal"><UserRound /> My portal</Link></Button>}
    >
      <TabBar value={tab} onChange={setTab} tabs={[
        { id: "overview", label: "Overview" },
        { id: "shipments", label: "Shipments" },
        { id: "quotes", label: "Quotes & Enquiries" },
        { id: "customers", label: "Customers" },
        { id: "reports", label: "Reports" },
      ]} />
      {isLoading || !data ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
      ) : (
        <>
          {tab === "overview" && <OverviewTab d={data} go={setTab} />}
          {tab === "shipments" && <ShipmentsTab d={data} />}
          {tab === "quotes" && <QuotesTab d={data} />}
          {tab === "customers" && <CustomersTab d={data} />}
          {tab === "reports" && <ReportsTab d={data} />}
        </>
      )}
    </DashboardShell>
  );
}

function OverviewTab({ d, go }: { d: Overview; go: (t: Tab) => void }) {
  const active = d.shipments.filter((s) => s.current_status !== "Delivered").length;
  const newQuotes = d.quotes.filter((q) => q.quote_status === "New").length;
  return (
    <div className="grid gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Active shipments" value={active} />
        <Stat label="Delivered" value={d.shipments.length - active} />
        <Stat label="New quote requests" value={newQuotes} />
        <Stat label="Customers" value={d.customers.length} />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">Latest shipments</h2><button className="text-sm text-gold" onClick={() => go("shipments")}>View all</button></div>
          {d.shipments.slice(0, 5).map((s) => (
            <div key={s.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 border-t border-navy-foreground/10 py-2.5 text-sm">
              <span className="truncate font-medium">{s.tracking_reference}</span><span className="text-gold">{s.current_status}</span>
            </div>
          ))}
          {!d.shipments.length && <p className="text-sm text-navy-foreground/60">No shipments yet.</p>}
        </GlassCard>
        <GlassCard>
          <div className="mb-3 flex items-center justify-between"><h2 className="font-bold">Latest requests</h2><button className="text-sm text-gold" onClick={() => go("quotes")}>View all</button></div>
          {d.quotes.slice(0, 5).map((q) => (
            <div key={q.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 border-t border-navy-foreground/10 py-2.5 text-sm">
              <span className="truncate">{q.full_name} · {q.service}</span><span className="text-gold">{q.quote_status}</span>
            </div>
          ))}
          {!d.quotes.length && <p className="text-sm text-navy-foreground/60">No requests yet.</p>}
        </GlassCard>
      </div>
    </div>
  );
}

function useRefresh() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["admin"] });
}

function ShipmentsTab({ d }: { d: Overview }) {
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [q, setQ] = useState("");
  const rows = d.shipments.filter((s) => !q || [s.tracking_reference, s.origin, s.destination].some((v) => v?.toLowerCase().includes(q.toLowerCase())));
  const custName = (id: string | null) => d.customers.find((c) => c.id === id)?.full_name || d.customers.find((c) => c.id === id)?.email || "Unassigned";
  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search reference, origin or destination" className={glassField + " sm:flex-1"} />
        <Button variant="gold" onClick={() => setEditing(editing === "new" ? null : "new")}><Plus /> Register shipment</Button>
      </div>
      {editing === "new" && <ShipmentForm d={d} onDone={() => setEditing(null)} />}
      {rows.map((s) => (
        <GlassCard key={s.id} className="p-0">
          <button onClick={() => setEditing(editing === s.id ? null : s.id)} className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4 text-left sm:p-5">
            <div className="min-w-0">
              <p className="truncate font-display font-bold">{s.tracking_reference}</p>
              <p className="truncate text-sm text-navy-foreground/65">{s.origin ?? "—"} → {s.destination ?? "—"} · {custName(s.customer_id)}</p>
            </div>
            <span className="shrink-0 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold">{s.current_status}</span>
          </button>
          {editing === s.id && (
            <div className="grid gap-6 border-t border-navy-foreground/10 p-4 sm:p-5 lg:grid-cols-2">
              <ShipmentForm d={d} row={s} onDone={() => setEditing(null)} />
              <EventPanel shipmentId={s.id} current={s.current_status} />
            </div>
          )}
        </GlassCard>
      ))}
      {!rows.length && <GlassCard><p className="text-center text-navy-foreground/65">No shipments found.</p></GlassCard>}
    </div>
  );
}

function ShipmentForm({ d, row, onDone }: { d: Overview; row?: Overview["shipments"][number]; onDone: () => void }) {
  const create = useServerFn(createShipment);
  const update = useServerFn(updateShipment);
  const refresh = useRefresh();
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setBusy(true);
    try {
      if (row) {
        await update({ data: { id: row.id, ...f } });
        toast.success("Shipment saved");
      } else {
        const r = await create({ data: f });
        toast.success(`Shipment registered: ${r.reference}`);
      }
      await refresh();
      onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }
  const Wrap = row ? "div" : GlassCard;
  return (
    <Wrap>
      <form onSubmit={onSubmit} className="grid gap-3 sm:grid-cols-2">
        <h3 className="font-bold sm:col-span-2">{row ? "Shipment details" : "Register a new shipment"}</h3>
        <label className="grid gap-1 text-sm sm:col-span-2">Customer
          <select name="customerId" defaultValue={row?.customer_id ?? ""} className={glassField}>
            <option value="">Unassigned</option>
            {d.customers.map((c) => <option key={c.id} value={c.id}>{c.full_name || c.email}{c.company ? ` — ${c.company}` : ""}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm">Origin<input name="origin" defaultValue={row?.origin ?? ""} className={glassField} /></label>
        <label className="grid gap-1 text-sm">Destination<input name="destination" defaultValue={row?.destination ?? ""} className={glassField} /></label>
        <label className="grid gap-1 text-sm">Service
          <select name="service" defaultValue={row?.service ?? ""} className={glassField}><option value="">—</option>{SERVICE_OPTIONS.map((s) => <option key={s}>{s}</option>)}</select>
        </label>
        <label className="grid gap-1 text-sm">Cargo<input name="cargoDescription" defaultValue={row?.cargo_description ?? ""} className={glassField} /></label>
        <label className="grid gap-1 text-sm">Dispatch date<input type="date" name="dispatchDate" defaultValue={row?.dispatch_date ?? ""} className={glassField} /></label>
        <label className="grid gap-1 text-sm">Estimated delivery<input type="date" name="estimatedDelivery" defaultValue={row?.estimated_delivery ?? ""} className={glassField} /></label>
        <Button type="submit" variant="gold" disabled={busy} className="sm:col-span-2">{busy && <Loader2 className="animate-spin" />}{row ? "Save details" : "Register & generate reference"}</Button>
      </form>
    </Wrap>
  );
}

function EventPanel({ shipmentId, current }: { shipmentId: string; current: string }) {
  const fetchEvents = useServerFn(getShipmentEvents);
  const add = useServerFn(addShipmentEvent);
  const refresh = useRefresh();
  const qc = useQueryClient();
  const [busy, setBusy] = useState(false);
  const { data: events } = useQuery({ queryKey: ["admin-events", shipmentId], queryFn: () => fetchEvents({ data: { shipmentId } }) });
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = Object.fromEntries(new FormData(form)) as { status: string; location: string; note: string };
    setBusy(true);
    try {
      await add({ data: { shipmentId, status: f.status as (typeof SHIPMENT_STATUSES)[number], location: f.location, note: f.note } });
      toast.success("Update published");
      form.reset();
      await Promise.all([refresh(), qc.invalidateQueries({ queryKey: ["admin-events", shipmentId] })]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not publish update");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="grid content-start gap-4">
      <form onSubmit={onSubmit} className="grid gap-3">
        <h3 className="font-bold">Publish a verified update</h3>
        <select name="status" defaultValue={current} className={glassField}>{SHIPMENT_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        <input name="location" placeholder="Verified location (optional)" className={glassField} />
        <textarea name="note" rows={2} placeholder="Progress note (optional)" className={glassField} />
        <Button type="submit" variant="gold" disabled={busy}>{busy && <Loader2 className="animate-spin" />}Publish update</Button>
      </form>
      <ol className="grid gap-2 text-sm">
        {(events ?? []).map((e) => (
          <li key={e.id} className="rounded-lg border border-navy-foreground/10 p-2.5">
            <span className="font-semibold text-gold">{e.status}</span> · {new Date(e.occurred_at).toLocaleString()}{e.location && ` · ${e.location}`}
            {e.note && <p className="text-navy-foreground/65">{e.note}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}

function QuotesTab({ d }: { d: Overview }) {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<string | null>(null);
  const rows = d.quotes.filter((q) => filter === "all" || q.kind === filter);
  return (
    <div className="grid gap-4">
      <select value={filter} onChange={(e) => setFilter(e.target.value)} className={glassField + " sm:max-w-xs"}>
        <option value="all">All requests</option><option value="quote">Quote requests</option><option value="contact">General enquiries</option>
      </select>
      {rows.map((q) => (
        <GlassCard key={q.id} className="p-0">
          <button onClick={() => setOpen(open === q.id ? null : q.id)} className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4 text-left sm:p-5">
            <div className="min-w-0">
              <p className="truncate font-semibold">{q.full_name}{q.company && ` · ${q.company}`}</p>
              <p className="truncate text-sm text-navy-foreground/65">{q.kind === "quote" ? "Quote" : "Enquiry"} · {q.service} · {fmtDate(q.created_at)}</p>
            </div>
            <span className="shrink-0 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold">{q.quote_status}</span>
          </button>
          {open === q.id && <QuoteDetail q={q} />}
        </GlassCard>
      ))}
      {!rows.length && <GlassCard><p className="text-center text-navy-foreground/65">No requests yet.</p></GlassCard>}
    </div>
  );
}

function QuoteDetail({ q }: { q: Overview["quotes"][number] }) {
  const save = useServerFn(updateQuote);
  const refresh = useRefresh();
  const [busy, setBusy] = useState(false);
  const info: [string, string | null][] = [
    ["Email", q.email], ["Phone", q.phone], ["Origin", q.origin], ["Destination", q.destination],
    ["Shipment type", q.shipment_type], ["Transport", q.transport_method], ["Weight & dimensions", q.weight_dimensions],
    ["Preferred date", fmtDate(q.preferred_date)], ["Cargo", q.cargo_description], ["Details", q.shipment_details], ["Message", q.message],
  ];
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as { status: string; response: string };
    setBusy(true);
    try {
      await save({ data: { id: q.id, status: f.status as (typeof QUOTE_STATUSES)[number], response: f.response } });
      toast.success("Quote updated");
      await refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="grid gap-6 border-t border-navy-foreground/10 p-4 sm:p-5 lg:grid-cols-2">
      <dl className="grid content-start gap-2 text-sm">
        {info.filter(([, v]) => v).map(([k, v]) => (
          <div key={k} className="grid grid-cols-[8rem_minmax(0,1fr)] gap-2"><dt className="text-navy-foreground/55">{k}</dt><dd className="break-words">{v}</dd></div>
        ))}
        <a href={`mailto:${q.email}`} className="mt-2 text-gold hover:underline">Email customer directly</a>
      </dl>
      <form onSubmit={onSubmit} className="grid content-start gap-3">
        <label className="grid gap-1 text-sm">Status<select name="status" defaultValue={q.quote_status} className={glassField}>{QUOTE_STATUSES.map((s) => <option key={s}>{s}</option>)}</select></label>
        <label className="grid gap-1 text-sm">Quotation / response (visible to the customer in their portal)
          <textarea name="response" rows={6} defaultValue={q.admin_response ?? ""} className={glassField} placeholder="Prepared quotation, terms and next steps" />
        </label>
        <Button type="submit" variant="gold" disabled={busy}>{busy && <Loader2 className="animate-spin" />}Save response</Button>
      </form>
    </div>
  );
}

function CustomersTab({ d }: { d: Overview }) {
  const save = useServerFn(updateCustomer);
  const refresh = useRefresh();
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="grid gap-3">
      {d.customers.map((c) => {
        const count = d.shipments.filter((s) => s.customer_id === c.id).length;
        return (
          <GlassCard key={c.id} className="p-0">
            <button onClick={() => setOpen(open === c.id ? null : c.id)} className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4 text-left sm:p-5">
              <div className="min-w-0">
                <p className="truncate font-semibold">{c.full_name || "Unnamed customer"}{c.company && ` · ${c.company}`}</p>
                <p className="truncate text-sm text-navy-foreground/65">{c.email}{c.phone && ` · ${c.phone}`}</p>
              </div>
              <span className="shrink-0 text-sm text-gold">{count} shipment{count === 1 ? "" : "s"}</span>
            </button>
            {open === c.id && (
              <form
                className="grid gap-3 border-t border-navy-foreground/10 p-4 sm:grid-cols-3 sm:p-5"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
                  try { await save({ data: { id: c.id, ...f } }); toast.success("Customer saved"); await refresh(); } catch { toast.error("Could not save customer"); }
                }}
              >
                <input name="fullName" defaultValue={c.full_name ?? ""} placeholder="Full name" className={glassField} />
                <input name="company" defaultValue={c.company ?? ""} placeholder="Company" className={glassField} />
                <input name="phone" defaultValue={c.phone ?? ""} placeholder="Phone" className={glassField} />
                <Button type="submit" variant="gold" className="sm:col-span-3">Save customer</Button>
              </form>
            )}
          </GlassCard>
        );
      })}
      {!d.customers.length && <GlassCard><p className="text-center text-navy-foreground/65">No customers have registered yet.</p></GlassCard>}
    </div>
  );
}

function ReportsTab({ d }: { d: Overview }) {
  const byStatus = useMemo(() => SHIPMENT_STATUSES.map((s) => ({ s, n: d.shipments.filter((x) => x.current_status === s).length })), [d]);
  const max = Math.max(1, ...byStatus.map((b) => b.n));
  const quotesByStatus = QUOTE_STATUSES.map((s) => ({ s, n: d.quotes.filter((q) => q.kind === "quote" && q.quote_status === s).length }));
  const overdue = d.shipments.filter((s) => s.estimated_delivery && s.current_status !== "Delivered" && new Date(s.estimated_delivery) < new Date());
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlassCard>
        <h2 className="mb-4 font-bold">Shipments by status</h2>
        <div className="grid gap-2.5">
          {byStatus.map((b) => (
            <div key={b.s} className="grid grid-cols-[8.5rem_minmax(0,1fr)_2rem] items-center gap-3 text-sm">
              <span className="truncate text-navy-foreground/75">{b.s}</span>
              <div className="h-2.5 rounded-full bg-navy-foreground/10"><div className="h-full rounded-full bg-gold" style={{ width: `${(b.n / max) * 100}%` }} /></div>
              <span className="text-right font-semibold">{b.n}</span>
            </div>
          ))}
        </div>
      </GlassCard>
      <GlassCard>
        <h2 className="mb-4 font-bold">Quote pipeline</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {quotesByStatus.map((q) => (
            <div key={q.s} className="rounded-lg border border-navy-foreground/10 p-3"><p className="text-xs text-navy-foreground/60">{q.s}</p><p className="text-xl font-bold text-gold">{q.n}</p></div>
          ))}
        </div>
      </GlassCard>
      <GlassCard className="lg:col-span-2">
        <h2 className="mb-3 font-bold">Past estimated delivery ({overdue.length})</h2>
        {overdue.length ? overdue.map((s) => (
          <p key={s.id} className="border-t border-navy-foreground/10 py-2 text-sm">{s.tracking_reference} · ETA {fmtDate(s.estimated_delivery)} · {s.current_status}</p>
        )) : <p className="text-sm text-navy-foreground/60">No shipments are past their estimated delivery date.</p>}
        <p className="mt-4 text-xs text-navy-foreground/50">Notifications queued: {d.notifications.filter((n) => n.status === "pending").length}</p>
      </GlassCard>
    </div>
  );
}
