import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { trackingRefSchema } from "./enquiry-schema";

export type TrackingResult =
  | { status: "not_configured" }
  | { status: "not_found"; reference: string }
  | {
      status: "found";
      shipment: {
        reference: string;
        origin: string | null;
        destination: string | null;
        service: string | null;
        currentStatus: string;
        updatedAt: string;
        dispatchDate: string | null;
        estimatedDelivery: string | null;
        currentLocation: string | null;
      };
      events: { status: string; location: string | null; note: string | null; occurredAt: string }[];
    };

export const trackShipment = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => z.object({ reference: trackingRefSchema }).parse(data))
  .handler(async ({ data }): Promise<TrackingResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { count, error: countErr } = await supabaseAdmin
      .from("shipments")
      .select("id", { count: "exact", head: true });
    if (countErr) throw new Error("Tracking is temporarily unavailable.");
    if (!count) return { status: "not_configured" };

    const { data: shipment, error } = await supabaseAdmin
      .from("shipments")
      .select("id, tracking_reference, origin, destination, service, current_status, updated_at, dispatch_date, estimated_delivery, current_location")
      .eq("tracking_reference", data.reference)
      .maybeSingle();
    if (error) throw new Error("Tracking is temporarily unavailable.");
    if (!shipment) return { status: "not_found", reference: data.reference };

    const { data: events } = await supabaseAdmin
      .from("shipment_events")
      .select("status, location, note, occurred_at")
      .eq("shipment_id", shipment.id)
      .order("occurred_at", { ascending: false });

    return {
      status: "found",
      shipment: {
        reference: shipment.tracking_reference,
        origin: shipment.origin,
        destination: shipment.destination,
        service: shipment.service,
        currentStatus: shipment.current_status,
        updatedAt: shipment.updated_at,
        dispatchDate: shipment.dispatch_date,
        estimatedDelivery: shipment.estimated_delivery,
        currentLocation: shipment.current_location,
      },
      events: (events ?? []).map((e) => ({
        status: e.status,
        location: e.location,
        note: e.note,
        occurredAt: e.occurred_at,
      })),
    };
  });
