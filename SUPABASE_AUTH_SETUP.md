# Enable Email Signups in Supabase

## Issue
You're seeing "Email signups are disabled" error when trying to sign up.

## Solution: Enable Email Signups in Supabase Dashboard

### Steps:

1. **Go to your Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project: `jmlfvqoholffkegwfsyu`

2. **Navigate to Authentication Settings**
   - Click on **Authentication** in the left sidebar
   - Click on **Providers** tab

3. **Enable Email Provider**
   - Find **Email** in the list of providers
   - Toggle it **ON** (it should be enabled by default, but verify)
   - Make sure "Confirm email" is set according to your preference:
     - **OFF** for development/testing (no email confirmation required)
     - **ON** for production (requires email confirmation)

4. **Configure Email Settings (Optional)**
   - Go to **Settings** → **Auth**
   - Under **Email Auth**, you can:
     - Enable/disable email confirmations
     - Set up custom email templates
     - Configure redirect URLs

5. **For Development/Testing (Recommended)**
   - Disable "Confirm email" temporarily for easier testing
   - Users can sign up immediately without email verification
   - Enable it later for production

## Quick Fix for Development

If you want to test without email confirmation:

1. Go to **Authentication** → **Providers** → **Email**
2. Turn **OFF** the "Confirm email" toggle
3. Save changes
4. Try signing up again

## Alternative: Use Magic Link (Passwordless)

If you prefer passwordless authentication:

1. Go to **Authentication** → **Providers**
2. Enable **Magic Link** (if available)
3. Update the sign-in flow to use magic links instead

## Verify Settings

After enabling, test by:
1. Restarting your dev server
2. Going to `/auth/signup`
3. Creating a new account

If you still see the error, check:
- The provider is actually enabled (refresh the dashboard)
- You're using the correct project
- The anon key matches your project





