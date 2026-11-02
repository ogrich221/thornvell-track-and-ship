import { createServerFn } from "@tanstack/react-start";
import { enquirySchema, isLikelyBot } from "./enquiry-schema";

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => enquirySchema.parse(data))
  .handler(async ({ data }) => {
    // Silently accept bot submissions so they get no signal to retry.
    if (isLikelyBot(data)) return { ok: true as const };

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("enquiries").insert({
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
