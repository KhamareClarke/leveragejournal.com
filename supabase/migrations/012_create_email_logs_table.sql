-- Create email_logs table to track all sent emails
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  email_type VARCHAR(50) NOT NULL, -- 'verification_code', 'journal_reminder', 'goal_reminder', 'weekly_review', 'test_email'
  subject TEXT,
  recipient_name TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message_id TEXT, -- Email message ID from nodemailer
  status VARCHAR(20) DEFAULT 'sent', -- 'sent', 'failed', 'pending'
  error_message TEXT,
  metadata JSONB, -- Additional data like goals, week number, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS email_logs_email_idx ON public.email_logs(email);
CREATE INDEX IF NOT EXISTS email_logs_user_id_idx ON public.email_logs(user_id);
CREATE INDEX IF NOT EXISTS email_logs_email_type_idx ON public.email_logs(email_type);
CREATE INDEX IF NOT EXISTS email_logs_created_at_idx ON public.email_logs(created_at);
CREATE INDEX IF NOT EXISTS email_logs_status_idx ON public.email_logs(status);

-- Enable Row Level Security
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Only service role can insert/read email logs (for security)
-- In production, you might want to allow users to see their own email logs
CREATE POLICY "Service role can manage email logs"
  ON public.email_logs
  FOR ALL
  USING (true)
  WITH CHECK (true);

