-- Add password_hash and name columns to verification_codes table
-- This allows storing the user's password temporarily until code verification

ALTER TABLE public.verification_codes 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

ALTER TABLE public.verification_codes 
ADD COLUMN IF NOT EXISTS name TEXT;
