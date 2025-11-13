# Quick Fix: Create Verification Codes Table

## The Problem
The `verification_codes` table doesn't exist in your database yet.

## Solution: Run This SQL in Supabase

### Step 1: Go to Supabase Dashboard
1. Visit: https://supabase.com/dashboard/project/jmlfvqoholffkegwfsyu
2. Click on **SQL Editor** in the left sidebar
3. Click **New Query**

### Step 2: Copy and Paste This SQL

```sql


### Step 3: Run the SQL
1. Click **Run** (or press Ctrl+Enter)
2. You should see "Success. No rows returned"

### Step 4: Verify Table Created
Run this command to check:
```bash
npm run check-tables
```

You should now see `verification_codes` in the list!

---

## Alternative: Use the Migration File

The SQL is also in: `supabase/migrations/002_create_verification_codes_table.sql`

Just copy the entire file content and paste into Supabase SQL Editor.

---

## After Running SQL

1. Try signing up again
2. The verification code should be created successfully
3. Check your email for the code!




