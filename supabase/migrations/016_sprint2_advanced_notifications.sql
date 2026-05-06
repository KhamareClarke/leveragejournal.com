-- Sprint 2: Advanced notifications

-- 1) Orders: review + SMS tracking
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS review_requested_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS review_submitted BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS phone_number VARCHAR,
  ADD COLUMN IF NOT EXISTS sms_sent BOOLEAN DEFAULT false;

-- Backfill phone_number from legacy phone column when available
UPDATE public.orders
SET phone_number = phone
WHERE phone_number IS NULL AND phone IS NOT NULL;

-- 2) Reviews table (post-purchase review collection)
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS reviews_order_id_idx ON public.reviews(order_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS reviews_created_at_idx ON public.reviews(created_at);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage reviews" ON public.reviews;
CREATE POLICY "Service role can manage reviews"
  ON public.reviews
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 3) Product views tracking table for recommendation drip emails
CREATE TABLE IF NOT EXISTS public.product_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email_1_sent BOOLEAN DEFAULT false,
  email_2_sent BOOLEAN DEFAULT false,
  email_3_sent BOOLEAN DEFAULT false,
  purchased BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS product_views_user_email_idx ON public.product_views(user_email);
CREATE INDEX IF NOT EXISTS product_views_viewed_at_idx ON public.product_views(viewed_at);
CREATE INDEX IF NOT EXISTS product_views_purchased_idx ON public.product_views(purchased);

ALTER TABLE public.product_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage product views" ON public.product_views;
CREATE POLICY "Service role can manage product views"
  ON public.product_views
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION update_product_views_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_product_views_updated ON public.product_views;
CREATE TRIGGER on_product_views_updated
  BEFORE UPDATE ON public.product_views
  FOR EACH ROW
  EXECUTE FUNCTION update_product_views_updated_at();
