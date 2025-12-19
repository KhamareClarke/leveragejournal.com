-- Create foundation table for storing user's foundation answers
-- Stores personal answers from 'My Why', 'Vision', 'Values', 'Skills', 'Lessons Learned', etc.

CREATE TABLE IF NOT EXISTS public.foundation (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Foundation sections
  my_why TEXT,
  my_vision TEXT,
  my_values TEXT,
  my_skills TEXT,
  influences TEXT,
  lessons_learned TEXT,
  accountability_partner TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

  -- Ensure one foundation record per user
  UNIQUE(user_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS foundation_user_id_idx ON public.foundation(user_id);

-- Enable Row Level Security
ALTER TABLE public.foundation ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own foundation data
CREATE POLICY "Users can view their own foundation"
  ON public.foundation
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own foundation"
  ON public.foundation
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own foundation"
  ON public.foundation
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own foundation"
  ON public.foundation
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_foundation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on foundation updates
DROP TRIGGER IF EXISTS on_foundation_updated ON public.foundation;
CREATE TRIGGER on_foundation_updated
  BEFORE UPDATE ON public.foundation
  FOR EACH ROW EXECUTE FUNCTION public.update_foundation_updated_at();





