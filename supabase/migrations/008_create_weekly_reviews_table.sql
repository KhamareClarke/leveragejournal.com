-- Create weekly_reviews table for storing weekly review data
-- Captures wins, obstacles, lessons, next steps, and AI-generated summaries

CREATE TABLE IF NOT EXISTS public.weekly_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Week information
  week_start_date DATE NOT NULL, -- Monday of the week
  week_end_date DATE NOT NULL, -- Sunday of the week
  week_number INTEGER, -- Week number in the 90-day program (1-13)
  
  -- Review content
  wins TEXT, -- What went well this week
  obstacles TEXT, -- Challenges faced
  lessons TEXT, -- Key learnings
  next_steps TEXT, -- Plans for next week
  
  -- AI-generated insights
  ai_summary TEXT, -- AI-generated summary of the week
  trends TEXT, -- AI-identified trends
  insights TEXT, -- AI insights and recommendations
  
  -- Progress metrics (calculated from journal entries and goals)
  days_completed INTEGER DEFAULT 0, -- Number of days with journal entries
  goals_achieved INTEGER DEFAULT 0, -- Number of goals completed
  streak_days INTEGER DEFAULT 0, -- Current streak at end of week
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  -- Ensure one review per user per week
  UNIQUE(user_id, week_start_date)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS weekly_reviews_user_id_idx ON public.weekly_reviews(user_id);
CREATE INDEX IF NOT EXISTS weekly_reviews_week_start_date_idx ON public.weekly_reviews(week_start_date);
CREATE INDEX IF NOT EXISTS weekly_reviews_user_week_idx ON public.weekly_reviews(user_id, week_start_date);

-- Enable Row Level Security
ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own reviews
CREATE POLICY "Users can view their own weekly reviews"
  ON public.weekly_reviews
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly reviews"
  ON public.weekly_reviews
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own weekly reviews"
  ON public.weekly_reviews
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own weekly reviews"
  ON public.weekly_reviews
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_weekly_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on weekly_reviews updates
DROP TRIGGER IF EXISTS on_weekly_reviews_updated ON public.weekly_reviews;
CREATE TRIGGER on_weekly_reviews_updated
  BEFORE UPDATE ON public.weekly_reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_weekly_reviews_updated_at();




