import { describe, expect, it } from "vitest";
import { dashboardPath } from "../lib/dashboard-access";

describe("dashboard access", () => {
  it("sends admins directly to their operations dashboard", () => {
    expect(dashboardPath(true)).toBe("/admin");
  });
  it("keeps customers in their customer dashboard", () => {
    expect(dashboardPath(false)).toBe("/portal");
  });
});