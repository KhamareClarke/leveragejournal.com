-- Sprint 3: Store features

-- Optional ambassador flag on profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_ambassador BOOLEAN DEFAULT false;

-- 1) Referral program
CREATE TABLE IF NOT EXISTS public.referral_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  code VARCHAR UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  clicks INTEGER DEFAULT 0,
  conversions INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS referral_codes_user_id_idx ON public.referral_codes(user_id);
CREATE INDEX IF NOT EXISTS referral_codes_code_idx ON public.referral_codes(code);

CREATE TABLE IF NOT EXISTS public.referral_conversions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR REFERENCES public.referral_codes(code) ON DELETE CASCADE,
  new_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  converted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS referral_conversions_code_idx ON public.referral_conversions(code);
CREATE INDEX IF NOT EXISTS referral_conversions_new_user_id_idx ON public.referral_conversions(new_user_id);

CREATE TABLE IF NOT EXISTS public.referral_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  status VARCHAR DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS referral_rewards_user_id_idx ON public.referral_rewards(user_id);
CREATE INDEX IF NOT EXISTS referral_rewards_status_idx ON public.referral_rewards(status);

ALTER TABLE public.referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_conversions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referral_rewards ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage referral codes" ON public.referral_codes;
DROP POLICY IF EXISTS "Service role can manage referral conversions" ON public.referral_conversions;
DROP POLICY IF EXISTS "Service role can manage referral rewards" ON public.referral_rewards;

CREATE POLICY "Service role can manage referral codes"
  ON public.referral_codes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can manage referral conversions"
  ON public.referral_conversions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can manage referral rewards"
  ON public.referral_rewards FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 2) Loyalty rewards
CREATE TABLE IF NOT EXISTS public.loyalty_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  points INTEGER DEFAULT 0,
  tier VARCHAR DEFAULT 'bronze',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.loyalty_transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  points INTEGER NOT NULL,
  transaction_type VARCHAR NOT NULL,
  source_key VARCHAR UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS loyalty_transactions_user_id_idx ON public.loyalty_transactions(user_id);
CREATE INDEX IF NOT EXISTS loyalty_transactions_type_idx ON public.loyalty_transactions(transaction_type);

ALTER TABLE public.loyalty_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loyalty_transactions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role can manage loyalty accounts" ON public.loyalty_accounts;
DROP POLICY IF EXISTS "Service role can manage loyalty transactions" ON public.loyalty_transactions;

CREATE POLICY "Service role can manage loyalty accounts"
  ON public.loyalty_accounts FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Service role can manage loyalty transactions"
  ON public.loyalty_transactions FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 3) Seasonal campaigns
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  discount_code VARCHAR UNIQUE NOT NULL,
  discount_percent INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage campaigns" ON public.campaigns;
CREATE POLICY "Service role can manage campaigns"
  ON public.campaigns FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 4) Inventory / stock alerts
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID,
  product_name TEXT,
  stock_level INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 50,
  critical_stock_threshold INTEGER DEFAULT 10,
  low_stock_last_alert_at TIMESTAMP WITH TIME ZONE,
  critical_stock_last_alert_at TIMESTAMP WITH TIME ZONE,
  waitlist_enabled BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS inventory_product_id_idx ON public.inventory(product_id);
CREATE INDEX IF NOT EXISTS inventory_stock_level_idx ON public.inventory(stock_level);

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Service role can manage inventory" ON public.inventory;
CREATE POLICY "Service role can manage inventory"
  ON public.inventory FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
