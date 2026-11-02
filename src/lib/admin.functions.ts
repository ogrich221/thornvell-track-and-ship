import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { generateTrackingReference, QUOTE_STATUSES, SHIPMENT_STATUSES } from "./platform";

type Ctx = { supabase: { rpc: (fn: "has_role", args: { _user_id: string; _role: "admin" }) => PromiseLike<{ data: boolean | null }> }; userId: string };

async function requireAdmin(context: Ctx) {
  const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
  if (!data) throw new Error("Forbidden: staff access only");
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

const opt = z.string().trim().max(300).optional().or(z.literal("")).transform((v) => v || null);
const optDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().or(z.literal("")).transform((v) => v || null);

export const getAdminOverview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const db = await requireAdmin(context as unknown as Ctx);
    const [shipments, quotes, customers, notifications] = await Promise.all([
      db.from("shipments").select("*").order("created_at", { ascending: false }).limit(500),
      db.from("enquiries").select("*").order("created_at", { ascending: false }).limit(500),
      db.from("profiles").select("*").order("created_at", { ascending: false }).limit(500),
      db.from("notifications").select("id, status, channel, created_at, subject, user_id").order("created_at", { ascending: false }).limit(50),
    ]);
    return {
      shipments: shipments.data ?? [],
      quotes: quotes.data ?? [],
      customers: customers.data ?? [],
      notifications: notifications.data ?? [],
    };
  });

export const getShipmentEvents = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ shipmentId: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const db = await requireAdmin(context as unknown as Ctx);
    const { data: ev } = await db.from("shipment_events").select("*").eq("shipment_id", data.shipmentId).order("occurred_at", { ascending: false });
    return ev ?? [];
  });

const shipmentFields = z.object({
  customerId: z.string().uuid().optional().or(z.literal("")).transform((v) => v || null),
  origin: opt,
  destination: opt,
  service: opt,
  cargoDescription: opt,
  dispatchDate: optDate,
  estimatedDelivery: optDate,
});

async function recordEvent(
  db: Awaited<ReturnType<typeof requireAdmin>>,
  shipmentId: string,
  ev: { status: string; location: string | null; note: string | null },
) {
  const { data: event, error } = await db.from("shipment_events").insert({ shipment_id: shipmentId, ...ev }).select("id").single();
  if (error) throw new Error("Could not record the update.");
  const patch: { current_status: string; updated_at: string; current_location?: string } = { current_status: ev.status, updated_at: new Date().toISOString() };
  if (ev.location) patch.current_location = ev.location;
  const { data: s } = await db.from("shipments").update(patch).eq("id", shipmentId).select("customer_id, tracking_reference").single();

  // Queue a notification only for a genuine recorded event with an assigned customer who opted in.
  if (s?.customer_id) {
    const { data: p } = await db.from("profiles").select("notify_email").eq("id", s.customer_id).maybeSingle();
    if (p?.notify_email) {
      await db.from("notifications").insert({
        user_id: s.customer_id,
        shipment_id: shipmentId,
        event_id: event.id,
        channel: "email",
        status: "pending",
        subject: `${s.tracking_reference}: ${ev.status}`,
      });
    }
  }
}

export const createShipment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => shipmentFields.parse(d))
  .handler(async ({ context, data }) => {
    const db = await requireAdmin(context as unknown as Ctx);
    for (let attempt = 0; attempt < 5; attempt++) {
      const reference = generateTrackingReference();
      const { data: row, error } = await db
        .from("shipments")
        .insert({
          tracking_reference: reference,
          customer_id: data.customerId,
          origin: data.origin,
          destination: data.destination,
          service: data.service,
          cargo_description: data.cargoDescription,
          dispatch_date: data.dispatchDate,
          estimated_delivery: data.estimatedDelivery,
          current_status: "Shipment Registered",
        })
        .select("id, tracking_reference")
        .single();
      if (error?.code === "23505") continue;
      if (error || !row) throw new Error("Could not register shipment.");
      await recordEvent(db, row.id, { status: "Shipment Registered", location: data.origin, note: null });
      return { reference: row.tracking_reference };
    }
    throw new Error("Could not generate a unique reference. Try again.");
  });

export const updateShipment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => shipmentFields.extend({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    const db = await requireAdmin(context as unknown as Ctx);
    const { error } = await db
      .from("shipments")
      .update({
        customer_id: data.customerId,
        origin: data.origin,
        destination: data.destination,
        service: data.service,
        cargo_description: data.cargoDescription,
        dispatch_date: data.dispatchDate,
        estimated_delivery: data.estimatedDelivery,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.id);
    if (error) throw new Error("Could not save shipment.");
    return { ok: true };
  });

export const addShipmentEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ shipmentId: z.string().uuid(), status: z.enum(SHIPMENT_STATUSES), location: opt, note: z.string().trim().max(1000).optional().or(z.literal("")).transform((v) => v || null) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const db = await requireAdmin(context as unknown as Ctx);
    await recordEvent(db, data.shipmentId, { status: data.status, location: data.location, note: data.note });
    return { ok: true };
  });

export const updateQuote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) =>
    z.object({ id: z.string().uuid(), status: z.enum(QUOTE_STATUSES), response: z.string().trim().max(4000).optional().or(z.literal("")) }).parse(d),
  )
  .handler(async ({ context, data }) => {
    const db = await requireAdmin(context as unknown as Ctx);
    const { error } = await db
      .from("enquiries")
      .update({ quote_status: data.status, admin_response: data.response || null, responded_at: data.response ? new Date().toISOString() : null })
      .eq("id", data.id);
    if (error) throw new Error("Could not update quote.");
    return { ok: true };
  });

export const updateCustomer = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), fullName: opt, company: opt, phone: opt }).parse(d))
  .handler(async ({ context, data }) => {
    const db = await requireAdmin(context as unknown as Ctx);
    const { error } = await db.from("profiles").update({ full_name: data.fullName, company: data.company, phone: data.phone, updated_at: new Date().toISOString() }).eq("id", data.id);
    if (error) throw new Error("Could not update customer.");
    return { ok: true };
  });
