# Fix: "Signups not allowed for this instance"

## The Problem
You're getting "Signups not allowed" error. This means **signups are completely disabled** in Supabase, not just email confirmation.

## Solution: Enable Signups

### Step 1: Enable Signups

1. Go to Supabase Dashboard:
   - https://supabase.com/dashboard/project/jmlfvqoholffkegwfsyu
   - Click **Authentication** → **Settings** (or **Configuration**)

2. Find "Enable sign ups":
   - Look for a toggle/checkbox that says **"Enable sign ups"** or **"Allow new signups"**
   - Turn it **ON** ✅
   - Click **Save**

### Step 2: Enable Email Provider

1. Still in Authentication:
   - Click **Providers** → **Email**

2. Enable Email provider:
   - Make sure Email provider is **ENABLED** ✅
   - Turn OFF "Confirm email" (if you want code-based auth) ❌
   - Click **Save**

### Step 3: Verify Settings

Your settings should be:
- ✅ **Enable sign ups**: ON
- ✅ **Email provider**: ENABLED
- ❌ **Confirm email**: OFF (for code-based auth)

---

## Quick Check

After enabling signups, try signing up again. The error should be gone!

---

## Alternative: Check via SQL

If you can't find the setting, you can check the current config:

```sql
-- Check auth settings (read-only)
SELECT * FROM auth.config;
```

But you'll need to enable signups via the Dashboard UI.

---

## Why This Happens

Supabase has a setting that can completely disable new user signups. This is separate from:
- Email confirmation (just requires email verification)
- Email provider (just enables/disables email auth)

"Signups not allowed" means the entire signup feature is disabled.




