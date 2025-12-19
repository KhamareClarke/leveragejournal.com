# Fix: RLS Policies Blocking Verification Codes

## The Problem
The table exists but RLS (Row Level Security) policies are blocking inserts.

## Solution 1: Use Service Role Key (Recommended)

The code has been updated to use the service role key for server-side operations, which bypasses RLS.

**Make sure you have the service role key in `.env.local`:**

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

To get your service role key:
1. Go to Supabase Dashboard
2. Settings → API
3. Copy the "service_role" key (keep it secret!)

## Solution 2: Fix RLS Policies

If you prefer to use the anon key, update the RLS policies:

### Run this SQL in Supabase SQL Editor:

```sql
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can create verification codes" ON public.verification_codes;
DROP POLICY IF EXISTS "Anyone can verify codes" ON public.verification_codes;
DROP POLICY IF EXISTS "Anyone can update verification codes" ON public.verification_codes;

-- Create new policies that allow all operations
CREATE POLICY "Allow all operations on verification codes"
  ON public.verification_codes
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

This allows anyone to insert, select, and update verification codes.

## Solution 3: Disable RLS (Not Recommended for Production)

Only for testing:

```sql
ALTER TABLE public.verification_codes DISABLE ROW LEVEL SECURITY;
```

## Recommended Approach

**Use Solution 1** - Add the service role key to `.env.local`. This is the most secure approach for server-side operations.

The code has already been updated to use the service role key when available!





