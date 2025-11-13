-- Remove unique constraint on foundation table to allow multiple entries per day
-- This allows users to create multiple foundation entries, similar to goals

-- Drop the unique constraint on user_id and entry_date
ALTER TABLE public.foundation 
  DROP CONSTRAINT IF EXISTS foundation_user_id_entry_date_unique;

-- The table already has an id column (primary key), so we can have multiple entries per user per date
-- No need to add any new constraints



