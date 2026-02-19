-- Leverage Journal orders (saved when checkout completes)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT NOT NULL UNIQUE,
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  phone TEXT,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  amount_total INTEGER NOT NULL, -- in smallest currency unit (pence)
  price_display TEXT NOT NULL, -- e.g. "£19.99"
  currency TEXT DEFAULT 'gbp',
  shipping_address TEXT,
  billing_address TEXT,
  shipping_address_raw JSONB,
  billing_address_raw JSONB,
  shipping_name TEXT,
  payment_status TEXT DEFAULT 'paid',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS orders_stripe_session_id_idx ON public.orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS orders_customer_email_idx ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders(created_at);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Only backend (service role) can manage orders
CREATE POLICY "Service role can manage orders"
  ON public.orders
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
