# Email Templates Setup Guide

## Quick Setup Steps

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/jmlfvqoholffkegwfsyu
   - Navigate to **Authentication** → **Email Templates**

2. **Set Up Confirmation Email**
   - Click on **"Confirm signup"** template
   - Copy the HTML from `supabase/email-templates.md` (Email Confirmation Template)
   - Paste into the editor
   - **Subject**: `Confirm your Leverage Journal account`
   - Save

3. **Set Up Password Reset Email**
   - Click on **"Reset password"** template
   - Copy the HTML from `supabase/email-templates.md` (Password Reset Template)
   - Paste into the editor
   - **Subject**: `Reset your Leverage Journal password`
   - Save

## Email Template Variables

Supabase automatically replaces these:
- `{{ .ConfirmationURL }}` → The confirmation/reset link
- `{{ .Email }}` → User's email address
- `{{ .Token }}` → Confirmation token (if needed)

## What Changed in the Code

✅ **After Signup**: 
- If email confirmation is required → Redirects to signin page with success message
- If email confirmation is disabled → Goes directly to dashboard
- Fast redirect (no waiting for email)

✅ **Sign In Page**:
- Shows success message when user arrives from signup
- Pre-fills email address
- Clear instructions to check email

## Testing

1. Sign up with a new email
2. You'll be redirected to signin page immediately
3. Check your email for confirmation link
4. Click the link to confirm
5. Sign in with your credentials

## Email Settings

Make sure in **Authentication** → **Settings**:
- ✅ Email provider is enabled
- ✅ Site URL is set: `http://localhost:3000` (for dev)
- ✅ Redirect URLs includes: `http://localhost:3000/auth/callback`




