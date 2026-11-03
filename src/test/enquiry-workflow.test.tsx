import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EnquiryForm } from "@/components/site/EnquiryForm";

const { submit } = vi.hoisted(() => ({ submit: vi.fn() }));
vi.mock("@tanstack/react-start", () => ({ useServerFn: () => submit }));
vi.mock("@/lib/enquiry.functions", () => ({ submitEnquiry: () => {} }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });

describe("quote submission refresh", () => {
  it("refreshes customer and admin data only after a successful submission", async () => {
    submit.mockResolvedValue({ ok: true });
    const client = new QueryClient();
    const invalidate = vi.spyOn(client, "invalidateQueries");
    render(<QueryClientProvider client={client}><EnquiryForm kind="quote" /></QueryClientProvider>);
    fireEvent.change(screen.getByLabelText(/Full Name/), { target: { value: "Workflow Tester" } });
    fireEvent.change(screen.getByLabelText(/Email Address/), { target: { value: "tester@example.invalid" } });
    fireEvent.change(screen.getByLabelText(/Phone Number/), { target: { value: "+12025550123" } });
    fireEvent.change(screen.getByLabelText(/Service Required/), { target: { value: "Air Freight" } });
    fireEvent.click(screen.getByRole("button", { name: "Send Enquiry" }));
    await waitFor(() => expect(submit).toHaveBeenCalledOnce());
    await waitFor(() => expect(invalidate).toHaveBeenCalledWith({ queryKey: ["portal"] }));
    expect(invalidate).toHaveBeenCalledWith({ queryKey: ["admin"] });
    expect(submit.mock.calls[0]?.[0]?.data.kind).toBe("quote");
  });
});