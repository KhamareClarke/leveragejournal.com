# Debug: Verification Code Creation Failure

## Check These Issues:

### 1. .env.local Location
The `.env.local` file MUST be in the **root directory** (same level as `package.json`), NOT in `supabase/migrations/`.

**Correct location:**
```
leveragejournel/
  ├── .env.local  ← HERE (root)
  ├── package.json
  ├── app/
  └── supabase/
```

**Wrong location:**
```
leveragejournel/
  └── supabase/
      └── migrations/
          └── .env.local  ← WRONG!
```

### 2. Restart Dev Server
After adding/updating `.env.local`, you MUST restart the dev server:
1. Stop the server (Ctrl+C)
2. Start again: `npm run dev`

### 3. Check Actual Error
Open browser console (F12) and check the Network tab when you try to sign up. Look for the `/api/auth/send-code` request and see the actual error message.

### 4. Verify Service Role Key
Make sure the service role key in `.env.local` is correct:
- Go to Supabase Dashboard → Settings → API
- Copy the "service_role" key (not the anon key)
- Make sure it's the full key, not truncated

### 5. Test Database Connection
Run this to test if the table is accessible:
```bash
npm run check-tables
```

### 6. Check RLS Policies
If using anon key, the RLS policies might be blocking. Run this SQL in Supabase:

```sql
-- Check if policies exist
SELECT * FROM pg_policies WHERE tablename = 'verification_codes';

-- If needed, create/update policy
DROP POLICY IF EXISTS "Allow all operations on verification codes" ON public.verification_codes;
CREATE POLICY "Allow all operations on verification codes"
  ON public.verification_codes
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

### 7. Test Direct Database Insert
Try inserting directly in Supabase SQL Editor:

```sql
INSERT INTO public.verification_codes (email, code, expires_at, used)
VALUES ('test@example.com', '123456', NOW() + INTERVAL '10 minutes', false);
```

If this works, the table exists and RLS is the issue.
If this fails, there's a table structure issue.

---

## Quick Test

1. Check `.env.local` is in root directory
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is set
3. Restart dev server
4. Try signup again
5. Check browser console for exact error





