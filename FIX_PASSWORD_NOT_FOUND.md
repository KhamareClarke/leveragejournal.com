# Fix: "Password not found. Please sign up again."

## The Problem
When verifying the code, the password that was stored during signup is not being found in the database.

## Solution: Add the Missing Columns

The `password_hash` and `name` columns are missing from the `verification_codes` table.

### Step 1: Run the Migration

1. Go to **Supabase Dashboard**:
   - https://supabase.com/dashboard/project/jmlfvqoholffkegwfsyu
   - Click **SQL Editor** in the left sidebar

2. **Run this SQL**:

```sql
ALTER TABLE public.verification_codes 
ADD COLUMN IF NOT EXISTS password_hash TEXT;

ALTER TABLE public.verification_codes 
ADD COLUMN IF NOT EXISTS name TEXT;
```

3. Click **Run** (or press Ctrl+Enter)

4. You should see: `Success. No rows returned`

### Step 2: Verify the Columns Exist

Run this SQL to check:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'verification_codes' 
AND table_schema = 'public'
ORDER BY column_name;
```

You should see `password_hash` and `name` in the list.

### Step 3: Try Signing Up Again

1. Go back to your app
2. Sign up with a new email (or delete the old verification code)
3. Enter your email and password
4. Click "Send Code"
5. Enter the code you receive
6. It should work now!

---

## Why This Happens

The `password_hash` column stores the user's password temporarily (in the `verification_codes` table) until they verify their code. After verification, the password is used to create their Supabase account.

If this column doesn't exist, the password can't be stored or retrieved, causing the "Password not found" error.

---

## Alternative: Check Existing Codes

If you have old verification codes in the database that don't have passwords, you can delete them:

```sql
DELETE FROM verification_codes 
WHERE password_hash IS NULL;
```

Then try signing up again.





