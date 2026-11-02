import svcForwarding from "@/assets/svc-forwarding.jpg";
import svcAir from "@/assets/svc-air.jpg";
import svcSea from "@/assets/svc-sea.jpg";
import svcRoad from "@/assets/svc-road.jpg";
import svcWarehouse from "@/assets/svc-warehouse.jpg";
import svcCourier from "@/assets/svc-courier.jpg";
import indManufacturing from "@/assets/ind-manufacturing.jpg";
import indOilgas from "@/assets/ind-oilgas.jpg";
import indConstruction from "@/assets/ind-construction.jpg";
import indAgriculture from "@/assets/ind-agriculture.jpg";
import indRetail from "@/assets/ind-retail.jpg";
import indAutomotive from "@/assets/ind-automotive.jpg";
import indPharma from "@/assets/ind-pharma.jpg";
import indConsumer from "@/assets/ind-consumer.jpg";

/**
 * Editable company contact details. Empty strings render as
 * "to be confirmed" placeholders; WhatsApp links appear only once a
 * verified number (digits with country code, e.g. "15551234567") is set.
 */
export const CONTACT = {
  address: "",
  email: "",
  phone: "",
  whatsapp: "",
  hours: "",
};

export const SOCIAL = [
  { label: "LinkedIn", href: "" },
  { label: "Facebook", href: "" },
  { label: "Instagram", href: "" },
  { label: "X", href: "" },
];

export const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/services", label: "Services" },
  { to: "/industries", label: "Industries" },
  { to: "/track", label: "Track Shipment" },
  { to: "/contact", label: "Contact" },
] as const;

export const SERVICES = [
  { id: "freight-forwarding", short: "Freight Forwarding", title: "International Freight Forwarding", img: svcForwarding, desc: "Coordinated freight solutions for international cargo movement, including shipment planning, freight coordination, and transportation arrangements." },
  { id: "air-freight", short: "Air Freight", title: "Air Freight", img: svcAir, desc: "Air cargo coordination for time-sensitive shipments, offering efficient transportation planning and professional shipment management." },
  { id: "sea-freight", short: "Sea Freight", title: "Sea Freight", img: svcSea, desc: "Ocean freight solutions for commercial cargo, containerized shipments, and international import and export requirements." },
  { id: "road-transportation", short: "Road Transportation", title: "Road Transportation", img: svcRoad, desc: "Reliable road transportation solutions for domestic cargo movement, commercial deliveries, and distribution requirements." },
  { id: "warehousing", short: "Warehousing", title: "Warehousing & Distribution", img: svcWarehouse, desc: "Organized storage and distribution support designed to help businesses manage inventory and coordinate goods movement." },
  { id: "courier", short: "Courier Services", title: "Courier & Express Delivery", img: svcCourier, desc: "Professional parcel and document delivery coordination for businesses and individuals requiring dependable delivery services." },
];

export const INDUSTRIES = [
  { title: "Manufacturing & Industrial Supplies", img: indManufacturing, desc: "Raw materials, components, and finished goods that need scheduled, carefully coordinated movement between plants and buyers." },
  { title: "Oil & Gas", img: indOilgas, desc: "Heavy equipment, pipe, and project materials that often call for specialised planning, documentation, and handling arrangements." },
  { title: "Construction & Infrastructure", img: indConstruction, desc: "Bulky and oversized materials timed to project milestones, where delivery sequencing on site matters." },
  { title: "Agriculture & Agricultural Products", img: indAgriculture, desc: "Seasonal produce, inputs, and bulk goods where timing, packaging, and storage conditions shape the plan." },
  { title: "Retail & E-commerce", img: indRetail, desc: "High-volume parcels and stock replenishment that depend on predictable transit and clear delivery updates." },
  { title: "Automotive & Spare Parts", img: indAutomotive, desc: "Vehicles, components, and spare parts that need secure packing and dependable lead times to keep lines and workshops moving." },
  { title: "Pharmaceuticals & Healthcare Supplies", img: indPharma, desc: "Medical and healthcare supplies where documentation and handling requirements are reviewed case by case before booking." },
  { title: "Consumer Goods", img: indConsumer, desc: "Packaged goods moving from suppliers to distributors and retailers, balancing cost, speed, and inventory flow." },
];

export const SERVICE_OPTIONS = [...SERVICES.map((s) => s.title), "Other / Not sure"];
