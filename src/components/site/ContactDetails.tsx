import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { CONTACT } from "@/lib/site";

const TBC = "To be confirmed";

export function ContactDetails() {
  const items = [
    { icon: MapPin, label: "Corporate Office", value: CONTACT.address || TBC },
    { icon: Mail, label: "Business Email", value: CONTACT.email || TBC, href: CONTACT.email && `mailto:${CONTACT.email}` },
    { icon: Phone, label: "Telephone", value: CONTACT.phone || TBC, href: CONTACT.phone && `tel:${CONTACT.phone.replace(/\s/g, "")}` },
    { icon: MessageCircle, label: "WhatsApp", value: CONTACT.whatsapp ? `+${CONTACT.whatsapp}` : TBC, href: CONTACT.whatsapp && `https://wa.me/${CONTACT.whatsapp}` },
    { icon: Clock, label: "Business Hours", value: CONTACT.hours || TBC },
  ];
  return (
    <ul className="space-y-6">
      {items.map((i) => (
        <li key={i.label} className="flex gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-navy text-gold"><i.icon className="h-5 w-5" /></span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{i.label}</p>
            {i.href ? (
              <a href={i.href} target={i.label === "WhatsApp" ? "_blank" : undefined} rel="noreferrer" className="mt-1 block font-medium text-navy-deep hover:text-gold">{i.value}</a>
            ) : (
              <p className={`mt-1 font-medium ${i.value === TBC ? "text-muted-foreground italic" : "text-navy-deep"}`}>{i.value}</p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
