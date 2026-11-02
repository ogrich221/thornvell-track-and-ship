import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, LogOut, Mail, MessageCircle, Package, Phone, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { DashboardShell, GlassCard, glassField, Stat, TabBar } from "@/components/portal/DashboardShell";
import { ShipmentCard, TrackingForm } from "@/components/site/TrackingForm";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { ContactDetails } from "@/components/site/ContactDetails";
import { fmtDate } from "@/lib/platform";
import { useSession } from "@/hooks/use-session";

export const Route = createFileRoute("/_authenticated/portal")({
  head: () => ({
    meta: [
      { title: "Customer Dashboard — Thornvell Logistics" },
      { name: "description", content: "Manage your shipments, monitor delivery progress and review quote requests." },
      { property: "og:title", content: "Customer Dashboard — Thornvell Logistics" },
      { property: "og:description", content: "Your Thornvell Logistics customer portal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Portal,
});

type Tab = "overview" | "shipments" | "quotes" | "new-quote" | "profile" | "support";

function usePortalData(userId: string | undefined) {
  return useQuery({
    queryKey: ["portal", userId],
    enabled: !!userId,
    queryFn: async () => {
      const [s, q, p] = await Promise.all([
        supabase.from("shipments").select("*").eq("customer_id", userId!).order("created_at", { ascending: false }),
        supabase.from("enquiries").select("*").eq("user_id", userId!).order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").eq("id", userId!).maybeSingle(),
      ]);
      if (s.error || q.error || p.error) throw new Error("Could not load your dashboard.");
      return { shipments: s.data, quotes: q.data, profile: p.data };
    },
  });
}

function Portal() {
  const { user, isAdmin } = useSession();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [tab, setTab] = useState<Tab>("overview");
  const [openId, setOpenId] = useState<string | null>(null);
  const { data, isLoading, error } = usePortalData(user?.id);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const shipments = data?.shipments ?? [];
  const active = shipments.filter((s) => s.current_status !== "Delivered");
  const name = data?.profile?.full_name?.split(" ")[0];

  return (
    <DashboardShell
      eyebrow={name ? `Hello, ${name}` : "Customer Portal"}
      title="Welcome to Thornvell Logistics."
      intro="Manage your shipments, monitor delivery progress, and stay connected with your logistics partner."
      actions={
        <>
          {isAdmin && <Button asChild variant="glass"><Link to="/admin"><ShieldCheck /> Admin</Link></Button>}
          <Button variant="glass" onClick={signOut}><LogOut /> Sign out</Button>
        </>
      }
    >
      <TabBar
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "shipments", label: "Shipments" },
          { id: "quotes", label: "Quotes" },
          { id: "new-quote", label: "Request a Quote" },
          { id: "profile", label: "Profile" },
          { id: "support", label: "Support" },
        ]}
      />
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>
      ) : error ? (
        <GlassCard><p className="text-destructive">{(error as Error).message}</p></GlassCard>
      ) : (
        <>
          {tab === "overview" && (
            <div className="grid gap-6">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Stat label="Active shipments" value={active.length} />
                <Stat label="Delivered" value={shipments.length - active.length} />
                <Stat label="Quote requests" value={data?.quotes.length ?? 0} />
                <Stat label="Awaiting reply" value={data?.quotes.filter((q) => !q.admin_response).length ?? 0} />
              </div>
              <GlassCard>
                <h2 className="mb-4 text-lg font-bold">Track any shipment</h2>
                <TrackingForm inputId="track-portal" placeholder="Enter a tracking reference" buttonLabel="Track" />
              </GlassCard>
              <ShipmentList rows={active.slice(0, 5)} openId={openId} setOpenId={setOpenId} empty="You have no active shipments right now." />
            </div>
          )}
          {tab === "shipments" && <ShipmentList rows={shipments} openId={openId} setOpenId={setOpenId} empty="No shipments have been assigned to your account yet." />}
          {tab === "quotes" && <QuoteList quotes={data?.quotes ?? []} onNew={() => setTab("new-quote")} />}
          {tab === "new-quote" && <EnquiryForm kind="quote" />}
          {tab === "profile" && data?.profile && <ProfileForm profile={data.profile} onSaved={() => qc.invalidateQueries({ queryKey: ["portal"] })} />}
          {tab === "support" && (
            <div className="grid gap-6 lg:grid-cols-5">
              <GlassCard className="lg:col-span-2">
                <h2 className="mb-4 text-lg font-bold">Contact support</h2>
                <div className="[&_*]:!text-navy-foreground/85"><ContactDetails /></div>
              </GlassCard>
              <div className="lg:col-span-3"><EnquiryForm kind="contact" /></div>
            </div>
          )}
        </>
      )}
    </DashboardShell>
  );
}

type ShipmentRow = NonNullable<ReturnType<typeof usePortalData>["data"]>["shipments"][number];

function ShipmentList({ rows, openId, setOpenId, empty }: { rows: ShipmentRow[]; openId: string | null; setOpenId: (id: string | null) => void; empty: string }) {
  if (!rows.length)
    return (
      <GlassCard className="flex flex-col items-center py-12 text-center">
        <Package className="h-10 w-10 text-gold" />
        <p className="mt-3 text-navy-foreground/75">{empty}</p>
      </GlassCard>
    );
  return (
    <div className="grid gap-3">
      {rows.map((s) => (
        <GlassCard key={s.id} className="p-0">
          <button onClick={() => setOpenId(openId === s.id ? null : s.id)} className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4 text-left sm:p-5">
            <div className="min-w-0">
              <p className="truncate font-display font-bold">{s.tracking_reference}</p>
              <p className="truncate text-sm text-navy-foreground/65">{s.origin ?? "—"} → {s.destination ?? "—"}{s.estimated_delivery && ` · ETA ${fmtDate(s.estimated_delivery)}`}</p>
            </div>
            <span className="shrink-0 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold">{s.current_status}</span>
          </button>
          {openId === s.id && <ShipmentDetail row={s} />}
        </GlassCard>
      ))}
    </div>
  );
}

function ShipmentDetail({ row }: { row: ShipmentRow }) {
  const { data: events, isLoading } = useQuery({
    queryKey: ["events", row.id],
    queryFn: async () => (await supabase.from("shipment_events").select("*").eq("shipment_id", row.id).order("occurred_at", { ascending: false })).data ?? [],
  });
  if (isLoading) return <div className="p-5"><Loader2 className="animate-spin text-gold" /></div>;
  return (
    <div className="p-3 pt-0 sm:p-5 sm:pt-0">
      <ShipmentCard
        shipment={{ reference: row.tracking_reference, origin: row.origin, destination: row.destination, service: row.service, currentStatus: row.current_status, updatedAt: row.updated_at, dispatchDate: row.dispatch_date, estimatedDelivery: row.estimated_delivery, currentLocation: row.current_location }}
        events={(events ?? []).map((e) => ({ status: e.status, location: e.location, note: e.note, occurredAt: e.occurred_at }))}
      />
    </div>
  );
}

type QuoteRow = NonNullable<ReturnType<typeof usePortalData>["data"]>["quotes"][number];

function QuoteList({ quotes, onNew }: { quotes: QuoteRow[]; onNew: () => void }) {
  if (!quotes.length)
    return (
      <GlassCard className="flex flex-col items-center py-12 text-center">
        <p className="text-navy-foreground/75">You haven't requested any quotes yet.</p>
        <Button variant="gold" className="mt-4" onClick={onNew}>Request a quote</Button>
      </GlassCard>
    );
  return (
    <div className="grid gap-3">
      {quotes.map((q) => (
        <GlassCard key={q.id}>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <p className="font-semibold">{q.service}</p>
              <p className="text-sm text-navy-foreground/65">{q.origin ?? "—"} → {q.destination ?? "—"} · {fmtDate(q.created_at)}</p>
            </div>
            <span className="shrink-0 rounded-full bg-gold/20 px-3 py-1 text-xs font-semibold text-gold">{q.quote_status}</span>
          </div>
          {q.admin_response && (
            <div className="mt-4 rounded-lg border border-gold/30 bg-gold/10 p-3 text-sm">
              <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gold">Response from Thornvell</p>
              <p className="whitespace-pre-wrap">{q.admin_response}</p>
            </div>
          )}
        </GlassCard>
      ))}
    </div>
  );
}

type Profile = NonNullable<NonNullable<ReturnType<typeof usePortalData>["data"]>["profile"]>;

function ProfileForm({ profile, onSaved }: { profile: Profile; onSaved: () => void }) {
  const [busy, setBusy] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: String(fd.get("fullName") || "").slice(0, 120) || null,
        company: String(fd.get("company") || "").slice(0, 160) || null,
        phone: String(fd.get("phone") || "").slice(0, 25) || null,
        notify_email: fd.get("notifyEmail") === "on",
        notify_sms: fd.get("notifySms") === "on",
        notify_whatsapp: fd.get("notifyWhatsapp") === "on",
        updated_at: new Date().toISOString(),
      })
      .eq("id", profile.id);
    setBusy(false);
    if (error) return toast.error("Could not save your profile.");
    toast.success("Profile saved");
    onSaved();
  }
  const prefs = [
    { name: "notifyEmail", label: "Email updates", icon: Mail, on: profile.notify_email, note: "" },
    { name: "notifySms", label: "SMS updates", icon: Phone, on: profile.notify_sms, note: "Coming soon" },
    { name: "notifyWhatsapp", label: "WhatsApp updates", icon: MessageCircle, on: profile.notify_whatsapp, note: "Coming soon" },
  ];
  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-2">
      <GlassCard className="grid gap-4">
        <h2 className="text-lg font-bold">Your details</h2>
        <label className="grid gap-1.5 text-sm">Full name<input name="fullName" defaultValue={profile.full_name ?? ""} className={glassField} /></label>
        <label className="grid gap-1.5 text-sm">Company<input name="company" defaultValue={profile.company ?? ""} className={glassField} /></label>
        <label className="grid gap-1.5 text-sm">Phone<input name="phone" type="tel" defaultValue={profile.phone ?? ""} className={glassField} /></label>
        <label className="grid gap-1.5 text-sm">Email<input value={profile.email ?? ""} disabled className={glassField + " opacity-60"} /></label>
      </GlassCard>
      <GlassCard className="grid content-start gap-4">
        <h2 className="text-lg font-bold">Notification preferences</h2>
        <p className="text-sm text-navy-foreground/65">We only notify you when a genuine update is recorded on one of your shipments.</p>
        {prefs.map((p) => (
          <label key={p.name} className="flex items-center gap-3 rounded-lg border border-navy-foreground/10 p-3">
            <p.icon className="h-5 w-5 shrink-0 text-gold" />
            <span className="min-w-0 flex-1 text-sm font-medium">{p.label} {p.note && <span className="ml-1 text-xs text-navy-foreground/50">{p.note}</span>}</span>
            <input type="checkbox" name={p.name} defaultChecked={p.on} className="h-5 w-5 accent-gold" />
          </label>
        ))}
        <Button type="submit" variant="gold" size="xl" disabled={busy} className="mt-2">{busy && <Loader2 className="animate-spin" />}Save changes</Button>
      </GlassCard>
    </form>
  );
}
