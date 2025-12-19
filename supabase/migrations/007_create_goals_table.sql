-- Create goals table for storing user goals
-- Supports full CRUD operations with categories, types, milestones, and progress tracking

CREATE TABLE IF NOT EXISTS public.goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic goal information
  title TEXT NOT NULL,
  description TEXT, -- What
  why TEXT, -- Why this goal matters
  how TEXT, -- How to achieve it
  
  -- Goal metadata
  type VARCHAR(20) NOT NULL DEFAULT 'short', -- 'short', 'medium', 'long'
  category TEXT, -- User-defined category
  timeline DATE, -- Target completion date
  reward TEXT, -- Reward for achieving the goal
  
  -- Progress tracking
  progress INTEGER DEFAULT 0, -- 0-100 percentage
  status VARCHAR(20) DEFAULT 'active', -- 'active', 'completed', 'paused', 'cancelled'
  
  -- Milestones (stored as JSONB array)
  milestones JSONB DEFAULT '[]'::jsonb, -- Array of {id, title, completed, due_date}
  
  -- Entry date for daily goal tracking
  entry_date DATE DEFAULT CURRENT_DATE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS goals_user_id_idx ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS goals_entry_date_idx ON public.goals(entry_date);
CREATE INDEX IF NOT EXISTS goals_user_entry_date_idx ON public.goals(user_id, entry_date);
CREATE INDEX IF NOT EXISTS goals_status_idx ON public.goals(status);
CREATE INDEX IF NOT EXISTS goals_type_idx ON public.goals(type);

-- Enable Row Level Security
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own goals
CREATE POLICY "Users can view their own goals"
  ON public.goals
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
  ON public.goals
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON public.goals
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON public.goals
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_goals_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on goals updates
DROP TRIGGER IF EXISTS on_goals_updated ON public.goals;
CREATE TRIGGER on_goals_updated
  BEFORE UPDATE ON public.goals
  FOR EACH ROW EXECUTE FUNCTION public.update_goals_updated_at();




