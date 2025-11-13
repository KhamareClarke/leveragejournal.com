-- Add separate fields to foundation table
-- Split my_why into: what_drives_me, what_im_done_with, who_im_building_for
-- Split influences into: books_that_shaped_me, mentors_role_models, core_principles
-- Note: empire_vision, financial_freedom_number, legacy_impact are NOT included
-- These appear as static template pages in the journal (page 010) before GOAL TIMELINE FRAMEWORK

ALTER TABLE public.foundation
ADD COLUMN IF NOT EXISTS what_drives_me TEXT,
ADD COLUMN IF NOT EXISTS what_im_done_with TEXT,
ADD COLUMN IF NOT EXISTS who_im_building_for TEXT,
ADD COLUMN IF NOT EXISTS books_that_shaped_me TEXT,
ADD COLUMN IF NOT EXISTS mentors_role_models TEXT,
ADD COLUMN IF NOT EXISTS core_principles TEXT;

-- Migrate existing my_why data to what_drives_me (optional - preserves existing data)
UPDATE public.foundation
SET what_drives_me = my_why
WHERE my_why IS NOT NULL AND what_drives_me IS NULL;

-- Migrate existing influences data to mentors_role_models (optional - preserves existing data)
UPDATE public.foundation
SET mentors_role_models = influences
WHERE influences IS NOT NULL AND mentors_role_models IS NULL;

