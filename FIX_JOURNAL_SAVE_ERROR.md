# Fix: "Failed to save journal entry"

## Common Causes and Solutions

### 1. Migration Not Run (Most Common)

**Error**: `relation "journal_entries" does not exist`

**Solution**: Run the migration in Supabase Dashboard:

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Open `supabase/migrations/004_create_journal_entries_table.sql`
3. Copy the entire SQL content
4. Paste into SQL Editor
5. Click **Run**

### 2. RLS Policies Blocking

**Error**: `permission denied` or error code `42501`

**Solution**: The migration should have created RLS policies automatically. If not, run:

```sql
-- Enable RLS
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own journal entries"
  ON public.journal_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries"
  ON public.journal_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
  ON public.journal_entries FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
  ON public.journal_entries FOR DELETE
  USING (auth.uid() = user_id);
```

### 3. Missing Unique Constraint Index

**Error**: `upsert` fails with constraint error

**Solution**: Create the unique constraint:

```sql
-- Create unique constraint if missing
ALTER TABLE public.journal_entries 
ADD CONSTRAINT journal_entries_user_date_unique 
UNIQUE (user_id, entry_date);
```

### 4. Check Server Logs

Check your terminal/console for detailed error messages. The improved error handling will show:
- Error code
- Error message
- Details
- Hints

## Quick Diagnostic Query

Run this in Supabase SQL Editor to check if everything is set up:

```sql
-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'journal_entries'
);

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'journal_entries';

-- Check policies exist
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'journal_entries';
```

## Test the Save

After fixing the issues:

1. Make sure you're signed in
2. Go to `/dashboard/daily`
3. Fill in some fields
4. Click "Save"
5. Check the error message (it should now be more detailed)





