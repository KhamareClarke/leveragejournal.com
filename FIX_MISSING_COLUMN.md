# Fix: Missing 'used' Column

## The Problem
The `verification_codes` table exists but is missing the `used` column.

Error: `Could not find the 'used' column of 'verification_codes' in the schema cache`

## Solution: Add the Missing Column

Run this SQL in Supabase SQL Editor:

```sql
-- Add the missing 'used' column
ALTER TABLE public.verification_codes 
ADD COLUMN IF NOT EXISTS used BOOLEAN DEFAULT false;

-- Verify the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'verification_codes'
ORDER BY ordinal_position;
```

## Complete Table Structure Should Be:

```sql
-- If table structure is completely wrong, recreate it:
DROP TABLE IF EXISTS public.verification_codes CASCADE;

CREATE TABLE public.verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes
CREATE INDEX verification_codes_email_idx ON public.verification_codes(email);
CREATE INDEX verification_codes_code_idx ON public.verification_codes(code);
CREATE INDEX verification_codes_expires_at_idx ON public.verification_codes(expires_at);

-- Enable RLS
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Allow all operations on verification codes" ON public.verification_codes;
CREATE POLICY "Allow all operations on verification codes"
  ON public.verification_codes
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## Quick Fix (Just Add Column)

If you just want to add the missing column:

```sql
ALTER TABLE public.verification_codes 
ADD COLUMN IF NOT EXISTS used BOOLEAN DEFAULT false;
```

Then test again with: `npm run test-code`





