import { z } from "zod";

export const enquirySchema = z.object({
  kind: z.enum(["contact", "quote"]),
  fullName: z.string().trim().min(2, "Please enter your full name").max(120),
  company: z.string().trim().max(160).optional().or(z.literal("")),
  email: z.string().trim().email("Please enter a valid email address").max(255),
  phone: z
    .string()
    .trim()
    .regex(/^[+()\d\s-]{6,25}$/, "Please enter a valid phone number"),
  service: z.string().trim().min(1, "Please choose a service").max(120),
  origin: z.string().trim().max(160).optional().or(z.literal("")),
  destination: z.string().trim().max(160).optional().or(z.literal("")),
  shipmentDetails: z.string().trim().max(2000).optional().or(z.literal("")),
  message: z.string().trim().max(4000).optional().or(z.literal("")),
  // Spam protection: hidden honeypot must stay empty; form must be open >= 3s.
  website: z.string().max(0, "Spam detected").optional().or(z.literal("")),
  startedAt: z.number().int(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const MIN_FILL_MS = 3000;

export function isLikelyBot(input: Pick<EnquiryInput, "website" | "startedAt">, now = Date.now()) {
  if (input.website) return true;
  return now - input.startedAt < MIN_FILL_MS;
}

export const trackingRefSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z0-9-]{4,40}$/, "Tracking references use 4–40 letters, numbers or dashes");
