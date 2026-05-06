-- Sprint 1 notification schema updates

-- 1) Welcome / first-entry tracking fields on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS welcome_email_sent_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS first_entry_date TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS first_entry_email_1_sent_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS first_entry_email_2_sent_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS first_entry_auto_generated_at TIMESTAMP WITH TIME ZONE;

-- 2) Cart abandonment state fields
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  user_phone TEXT,
  items JSONB DEFAULT '[]'::jsonb NOT NULL,
  total INTEGER DEFAULT 0 NOT NULL, -- pence
  currency TEXT DEFAULT 'gbp' NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  abandoned_at TIMESTAMP WITH TIME ZONE,
  email_sent_1h BOOLEAN DEFAULT false,
  email_sent_6h BOOLEAN DEFAULT false,
  email_sent_24h BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS carts_user_id_idx ON public.carts(user_id);
CREATE INDEX IF NOT EXISTS carts_user_email_idx ON public.carts(user_email);
CREATE INDEX IF NOT EXISTS carts_created_at_idx ON public.carts(created_at);
CREATE INDEX IF NOT EXISTS carts_abandoned_at_idx ON public.carts(abandoned_at);
CREATE INDEX IF NOT EXISTS carts_completed_at_idx ON public.carts(completed_at);

ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage carts" ON public.carts;
CREATE POLICY "Service role can manage carts"
  ON public.carts
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION update_carts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_carts_updated ON public.carts;
CREATE TRIGGER on_carts_updated
  BEFORE UPDATE ON public.carts
  FOR EACH ROW
  EXECUTE FUNCTION update_carts_updated_at();

-- 3) Failed payment recovery table
CREATE TABLE IF NOT EXISTS public.payment_failures (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  email VARCHAR NOT NULL,
  amount INTEGER NOT NULL,
  failure_reason VARCHAR,
  failed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email_sent_immediate BOOLEAN DEFAULT false,
  email_sent_6h BOOLEAN DEFAULT false,
  email_sent_24h BOOLEAN DEFAULT false,
  retry_successful BOOLEAN DEFAULT false,
  discount_code TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS payment_failures_email_idx ON public.payment_failures(email);
CREATE INDEX IF NOT EXISTS payment_failures_user_id_idx ON public.payment_failures(user_id);
CREATE INDEX IF NOT EXISTS payment_failures_failed_at_idx ON public.payment_failures(failed_at);
CREATE INDEX IF NOT EXISTS payment_failures_retry_successful_idx ON public.payment_failures(retry_successful);

ALTER TABLE public.payment_failures ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage payment failures" ON public.payment_failures;
CREATE POLICY "Service role can manage payment failures"
  ON public.payment_failures
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE OR REPLACE FUNCTION update_payment_failures_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS on_payment_failures_updated ON public.payment_failures;
CREATE TRIGGER on_payment_failures_updated
  BEFORE UPDATE ON public.payment_failures
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_failures_updated_at();
