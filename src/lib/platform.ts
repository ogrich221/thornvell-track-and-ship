export const SHIPMENT_STATUSES = [
  "Shipment Registered",
  "Processing",
  "Picked Up",
  "In Transit",
  "Arrived at Facility",
  "Out for Delivery",
  "Delivered",
] as const;
export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];

export const QUOTE_STATUSES = ["New", "In Review", "Quoted", "Accepted", "Declined", "Closed"] as const;

export const SHIPMENT_TYPES = ["General Cargo", "Containerised (FCL)", "Groupage (LCL)", "Bulk", "Hazardous", "Temperature Controlled", "Parcels / Documents", "Other"];
export const TRANSPORT_METHODS = ["Air Freight", "Sea Freight", "Road Transportation", "Courier & Express", "Multimodal", "Not sure"];

/** Generates a unique-looking reference like TV-261102-7K3QX. Uniqueness is enforced by the database. */
export function generateTrackingReference(now = new Date(), rand = Math.random) {
  const d = now.toISOString().slice(2, 10).replace(/-/g, "");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let s = "";
  for (let i = 0; i < 5; i++) s += chars[Math.floor(rand() * chars.length)];
  return `TV-${d}-${s}`;
}

export function statusIndex(status: string) {
  return SHIPMENT_STATUSES.indexOf(status as ShipmentStatus);
}

export function fmtDate(v: string | null | undefined) {
  if (!v) return null;
  return new Date(v).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}
