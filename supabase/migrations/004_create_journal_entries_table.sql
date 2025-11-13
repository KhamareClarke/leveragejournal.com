-- Create journal_entries table for storing 90 days of user journal entries
-- Each entry is linked to user ID and entry date

CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entry_date DATE NOT NULL,
  day_number INTEGER NOT NULL, -- Day 1-90 in the 90-day program
  gratitude TEXT,
  priority_1 TEXT,
  priority_2 TEXT,
  priority_3 TEXT,
  tasks JSONB DEFAULT '[]'::jsonb, -- Array of {id, text, completed}
  reflection TEXT,
  mood VARCHAR(50), -- e.g., 'happy', 'grateful', 'focused', etc.
  streak INTEGER DEFAULT 0, -- Current consecutive days
  completed BOOLEAN DEFAULT false, -- Whether the entry is marked as complete
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Ensure one entry per user per date
  UNIQUE(user_id, entry_date)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS journal_entries_user_id_idx ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS journal_entries_entry_date_idx ON public.journal_entries(entry_date);
CREATE INDEX IF NOT EXISTS journal_entries_user_date_idx ON public.journal_entries(user_id, entry_date);
CREATE INDEX IF NOT EXISTS journal_entries_day_number_idx ON public.journal_entries(user_id, day_number);

-- Enable Row Level Security
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own journal entries
CREATE POLICY "Users can view their own journal entries"
  ON public.journal_entries
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries"
  ON public.journal_entries
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
  ON public.journal_entries
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
  ON public.journal_entries
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_journal_entry_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on journal entry updates
CREATE TRIGGER on_journal_entry_updated
  BEFORE UPDATE ON public.journal_entries
  FOR EACH ROW
  EXECUTE FUNCTION update_journal_entry_updated_at();

-- Function to calculate streak for a user
CREATE OR REPLACE FUNCTION calculate_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_current_date DATE := CURRENT_DATE;
  v_has_entry BOOLEAN;
BEGIN
  -- Check if today has an entry
  SELECT EXISTS(
    SELECT 1 FROM public.journal_entries 
    WHERE user_id = p_user_id 
    AND entry_date = v_current_date
    AND completed = true
  ) INTO v_has_entry;
  
  IF NOT v_has_entry THEN
    -- If today doesn't have a completed entry, check yesterday
    v_current_date := v_current_date - INTERVAL '1 day';
  END IF;
  
  -- Count consecutive days with completed entries going backwards
  WHILE v_streak < 90 LOOP
    SELECT EXISTS(
      SELECT 1 FROM public.journal_entries 
      WHERE user_id = p_user_id 
      AND entry_date = v_current_date
      AND completed = true
    ) INTO v_has_entry;
    
    IF NOT v_has_entry THEN
      EXIT;
    END IF;
    
    v_streak := v_streak + 1;
    v_current_date := v_current_date - INTERVAL '1 day';
  END LOOP;
  
  RETURN v_streak;
END;
$$ LANGUAGE plpgsql;





