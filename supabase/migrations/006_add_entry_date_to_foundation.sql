-- Add entry_date column to foundation table to support day-wise entries
-- This allows users to write foundation entries for different dates

-- Add entry_date column if it doesn't exist
ALTER TABLE public.foundation 
  ADD COLUMN IF NOT EXISTS entry_date DATE DEFAULT CURRENT_DATE;

-- Update existing rows to have today's date if entry_date is NULL
UPDATE public.foundation 
SET entry_date = CURRENT_DATE 
WHERE entry_date IS NULL;

-- Make entry_date NOT NULL after setting defaults
ALTER TABLE public.foundation 
  ALTER COLUMN entry_date SET NOT NULL;

-- Drop the unique constraint on user_id (now we need unique per user per date)
-- Try common constraint names
ALTER TABLE public.foundation DROP CONSTRAINT IF EXISTS foundation_user_id_key;
ALTER TABLE public.foundation DROP CONSTRAINT IF EXISTS foundation_user_id_unique;

-- Add unique constraint on user_id and entry_date
ALTER TABLE public.foundation 
  DROP CONSTRAINT IF EXISTS foundation_user_id_entry_date_unique;
  
ALTER TABLE public.foundation 
  ADD CONSTRAINT foundation_user_id_entry_date_unique UNIQUE(user_id, entry_date);

-- Create index for faster date-based queries
CREATE INDEX IF NOT EXISTS foundation_entry_date_idx ON public.foundation(entry_date);
CREATE INDEX IF NOT EXISTS foundation_user_entry_date_idx ON public.foundation(user_id, entry_date);

ewq `