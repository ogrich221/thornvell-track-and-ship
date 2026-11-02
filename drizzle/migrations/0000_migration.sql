CREATE TABLE public.enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind text NOT NULL DEFAULT 'contact',
  full_name text NOT NULL,
  company text,
  email text NOT NULL,
  phone text NOT NULL,
  service text NOT NULL,
  origin text,
  destination text,
  shipment_details text,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.enquiries TO service_role;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_reference text NOT NULL UNIQUE,
  origin text,
  destination text,
  service text,
  current_status text NOT NULL DEFAULT 'Shipment Registered',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.shipments TO service_role;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.shipment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipment_id uuid NOT NULL REFERENCES public.shipments(id) ON DELETE CASCADE,
  status text NOT NULL,
  location text,
  note text,
  occurred_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.shipment_events TO service_role;
ALTER TABLE public.shipment_events ENABLE ROW LEVEL SECURITY;
CREATE INDEX ON public.shipment_events(shipment_id, occurred_at);