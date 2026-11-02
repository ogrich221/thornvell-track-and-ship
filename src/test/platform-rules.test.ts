import { describe, expect, it } from "vitest";
import { generateTrackingReference, SHIPMENT_STATUSES, statusIndex } from "@/lib/platform";

describe("platform rules", () => {
  it("tracking references follow TV-YYMMDD-XXXXX", () => {
    expect(generateTrackingReference(new Date("2026-11-02T10:00:00Z"), () => 0)).toBe("TV-261102-AAAAA");
  });
  it("has the seven agreed shipment statuses in order", () => {
    expect(SHIPMENT_STATUSES).toEqual(["Shipment Registered", "Processing", "Picked Up", "In Transit", "Arrived at Facility", "Out for Delivery", "Delivered"]);
    expect(statusIndex("Delivered")).toBe(6);
  });
});
