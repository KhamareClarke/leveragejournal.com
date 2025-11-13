-- Add vision-related fields to goals table
-- These fields are used for the MY VISION page in the journal

ALTER TABLE public.goals
ADD COLUMN IF NOT EXISTS empire_vision TEXT,
ADD COLUMN IF NOT EXISTS financial_freedom_number TEXT,
ADD COLUMN IF NOT EXISTS legacy_impact TEXT,
ADD COLUMN IF NOT EXISTS legacy_goals TEXT,
ADD COLUMN IF NOT EXISTS vision_goals TEXT,
ADD COLUMN IF NOT EXISTS strategic_goals TEXT;

