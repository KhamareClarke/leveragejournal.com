-- Create verification codes table for code-based authentication
CREATE TABLE IF NOT EXISTS public.verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS verification_codes_email_idx ON public.verification_codes(email);
CREATE INDEX IF NOT EXISTS verification_codes_code_idx ON public.verification_codes(code);
CREATE INDEX IF NOT EXISTS verification_codes_expires_at_idx ON public.verification_codes(expires_at);

-- Enable Row Level Security
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert codes (for signup)
CREATE POLICY "Anyone can create verification codes"
  ON public.verification_codes
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow code verification (for signin)
CREATE POLICY "Anyone can verify codes"
  ON public.verification_codes
  FOR SELECT
  USING (true);

-- Create policy to allow marking codes as used
CREATE POLICY "Anyone can update verification codes"
  ON public.verification_codes
  FOR UPDATE
  USING (true);

-- Function to clean up expired codes (optional, can be run periodically)
CREATE OR REPLACE FUNCTION public.cleanup_expired_codes()
RETURNS void AS $$
BEGIN
  DELETE FROM public.verification_codes
  WHERE expires_at < NOW() OR used = true;
END;
$$ LANGUAGE plpgsql;





