import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { enquirySchema, isLikelyBot } from "./enquiry-schema";

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => enquirySchema.parse(data))
  .handler(async ({ data }) => {
    // Silently accept bot submissions so they get no signal to retry.
    if (isLikelyBot(data)) return { ok: true as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // Link to the signed-in customer when a valid session token is attached.
    let userId: string | null = null;
    const auth = getRequestHeader("authorization");
    if (auth?.startsWith("Bearer ")) {
      const { data: u } = await supabaseAdmin.auth.getUser(auth.slice(7));
      userId = u.user?.id ?? null;
    }
    const { error } = await supabaseAdmin.from("enquiries").insert({
      user_id: userId,
      shipment_type: data.shipmentType || null,
      transport_method: data.transportMethod || null,
      cargo_description: data.cargoDescription || null,
      weight_dimensions: data.weightDimensions || null,
      preferred_date: data.preferredDate || null,
      kind: data.kind,
      full_name: data.fullName,
      company: data.company || null,
      email: data.email,
      phone: data.phone,
      service: data.service,
      origin: data.origin || null,
      destination: data.destination || null,
      shipment_details: data.shipmentDetails || null,
      message: data.message || null,
    });
    if (error) {
      console.error("enquiry insert failed", error.message);
      throw new Error("We couldn't send your enquiry right now. Please try again shortly.");
    }
    return { ok: true as const };
  });
