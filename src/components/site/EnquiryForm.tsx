import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { enquirySchema } from "@/lib/enquiry-schema";
import { submitEnquiry } from "@/lib/enquiry.functions";
import { SERVICE_OPTIONS } from "@/lib/site";
import { cn } from "@/lib/utils";

const fieldCls =
  "w-full rounded-lg border border-input bg-card px-4 py-3 text-sm text-foreground outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30 aria-[invalid=true]:border-destructive";

type Errors = Partial<Record<string, string>>;

export function EnquiryForm({ kind, defaultService = "" }: { kind: "contact" | "quote"; defaultService?: string }) {
  const submit = useServerFn(submitEnquiry);
  const startedAt = useRef(Date.now());
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const raw = Object.fromEntries(fd.entries()) as Record<string, string>;
    const parsed = enquirySchema.safeParse({ ...raw, kind, startedAt: startedAt.current });
    if (!parsed.success) {
      const errs: Errors = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] ??= i.message;
      setErrors(errs);
      const first = e.currentTarget.querySelector<HTMLElement>(`[name="${Object.keys(errs)[0]}"]`);
      first?.focus();
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      await submit({ data: parsed.data });
      setStatus("sent");
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  if (status === "sent")
    return (
      <div role="status" className="flex flex-col items-center rounded-2xl border border-border bg-card p-10 text-center shadow-elegant">
        <CheckCircle2 className="h-12 w-12 text-success" />
        <h3 className="mt-4 text-2xl font-bold">Thank you — your enquiry has been sent.</h3>
        <p className="mt-2 max-w-md text-muted-foreground">A member of our team will review your requirements and get back to you.</p>
        <Button variant="outline" className="mt-6" onClick={() => { startedAt.current = Date.now(); setStatus("idle"); }}>
          Send another enquiry
        </Button>
      </div>
    );

  const a = (name: string) => ({
    id: `f-${name}`,
    name,
    "aria-invalid": !!errors[name],
    "aria-describedby": errors[name] ? `f-${name}-err` : undefined,
    className: fieldCls,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 rounded-2xl border border-border bg-card p-6 shadow-elegant sm:grid-cols-2 md:p-10">
      <Field errors={errors} name="fullName" label="Full Name" required><input {...a("fullName")} autoComplete="name" /></Field>
      <Field errors={errors} name="company" label="Company Name"><input {...a("company")} autoComplete="organization" /></Field>
      <Field errors={errors} name="email" label="Email Address" required><input {...a("email")} type="email" autoComplete="email" /></Field>
      <Field errors={errors} name="phone" label="Phone Number" required><input {...a("phone")} type="tel" autoComplete="tel" /></Field>
      <Field errors={errors} name="service" label="Service Required" required full>
        <select {...a("service")} defaultValue={SERVICE_OPTIONS.includes(defaultService) ? defaultService : ""}>
          <option value="" disabled>Select a service</option>
          {SERVICE_OPTIONS.map((s) => <option key={s}>{s}</option>)}
        </select>
      </Field>
      <Field errors={errors} name="origin" label="Origin"><input {...a("origin")} placeholder="City, country" /></Field>
      <Field errors={errors} name="destination" label="Destination"><input {...a("destination")} placeholder="City, country" /></Field>
      <Field errors={errors} name="shipmentDetails" label="Shipment Details" full>
        <textarea {...a("shipmentDetails")} rows={3} placeholder="Cargo type, weight, dimensions, quantity, preferred dates" />
      </Field>
      <Field errors={errors} name="message" label="Additional Message" full><textarea {...a("message")} rows={4} /></Field>
      {/* Honeypot: hidden from people, filled by bots */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">We only use your details to respond to this enquiry.</p>
        <Button type="submit" variant="navy" size="xl" disabled={status === "sending"}>
          {status === "sending" && <Loader2 className="animate-spin" />}
          Send Enquiry
        </Button>
      </div>
      {status === "error" && <p role="alert" className="text-sm text-destructive sm:col-span-2">{serverError}</p>}
    </form>
  );
}

function Field({ name, label, required, children, full, errors }: { name: string; label: string; required?: boolean; children: React.ReactNode; full?: boolean; errors: Errors }) {
  return (
    <div className={cn(full && "sm:col-span-2")}>
      <label htmlFor={`f-${name}`} className="mb-2 block text-sm font-medium">
        {label} {required ? <span className="text-gold" aria-hidden>*</span> : <span className="text-muted-foreground">(optional)</span>}
      </label>
      {children}
      {errors[name] && <p id={`f-${name}-err`} className="mt-1.5 text-xs text-destructive">{errors[name]}</p>}
    </div>
  );
}
