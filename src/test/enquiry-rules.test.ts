import { describe, expect, it } from "vitest";
import { enquirySchema, isLikelyBot, trackingRefSchema } from "@/lib/enquiry-schema";

const valid = {
  kind: "contact" as const,
  fullName: "Jane Doe",
  email: "jane@example.com",
  phone: "+1 555 123 4567",
  service: "Air Freight",
  startedAt: 0,
};

describe("enquiry rules", () => {
  it("accepts a submission with only the required fields", () => {
    expect(enquirySchema.safeParse(valid).success).toBe(true);
  });
  it("rejects an invalid email", () => {
    expect(enquirySchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
  });
  it("treats a filled honeypot as a bot", () => {
    expect(isLikelyBot({ website: "x", startedAt: 0 }, 10_000)).toBe(true);
  });
  it("treats a form submitted under 3 seconds as a bot", () => {
    expect(isLikelyBot({ website: "", startedAt: 0 }, 2_999)).toBe(true);
    expect(isLikelyBot({ website: "", startedAt: 0 }, 3_000)).toBe(false);
  });
  it("normalises tracking references and rejects bad ones", () => {
    expect(trackingRefSchema.parse(" tl-1234 ")).toBe("TL-1234");
    expect(trackingRefSchema.safeParse("ab").success).toBe(false);
  });
});
