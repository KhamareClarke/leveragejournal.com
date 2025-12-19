# How to Delete User from Supabase

## The Problem
You deleted from custom tables, but the user still exists in `auth.users` (Supabase Auth table).

## Solution: Delete from auth.users

### Method 1: Supabase Dashboard (Easiest)

1. Go to Supabase Dashboard:
   - https://supabase.com/dashboard/project/jmlfvqoholffkegwfsyu
   - Click **Authentication** → **Users**

2. Find the user by email:
   - Search for `fizasaif0233@gmail.com`
   - Click on the user

3. Delete the user:
   - Click the **Delete** button (or trash icon)
   - Confirm deletion

4. Try signing up again!

---

### Method 2: SQL Editor (Faster for multiple users)

1. Go to Supabase Dashboard
2. Click **SQL Editor**
3. Run this SQL:

```sql
-- Delete user by email
DELETE FROM auth.users 
WHERE email = 'fizasaif0233@gmail.com';
```

**Warning:** This will delete the user from `auth.users`. The profile will be automatically deleted due to CASCADE.

---

### Method 3: Delete All Users (Nuclear Option)

```sql
-- Delete ALL users (use with caution!)
DELETE FROM auth.users;
```

---

## Why This Happens

- `auth.users` is Supabase's built-in authentication table
- Deleting from `profiles` or `verification_codes` doesn't delete from `auth.users`
- The email uniqueness check looks in `auth.users`
- You must delete from `auth.users` to allow re-registration

---

## After Deleting

1. User is removed from `auth.users`
2. Profile is automatically deleted (CASCADE)
3. You can sign up again with the same email
4. New account will be created

---

## Quick Test

After deleting, try signing up again with the same email. It should work!





