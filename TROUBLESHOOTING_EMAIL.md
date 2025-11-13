# Troubleshooting: Not Receiving Confirmation Emails

## Quick Checks

### 1. Check Spam/Junk Folder
- Emails often end up in spam folders
- Check your email's spam/junk folder
- Mark as "Not Spam" if found

### 2. Wait a Few Minutes
- Email delivery can take 1-5 minutes
- Sometimes longer during high traffic

### 3. Verify Email Address
- Double-check you entered the correct email
- Try signing up again with the same email

### 4. Check Supabase Email Settings

Go to your Supabase Dashboard:
1. **Authentication** → **Providers** → **Email**
   - Make sure Email provider is **ENABLED**
   - Check if "Confirm email" is ON or OFF

2. **Authentication** → **Settings**
   - Verify **Site URL** is set: `http://localhost:3000` (for development)
   - Check **Redirect URLs** includes: `http://localhost:3000/auth/callback`

3. **Authentication** → **Email Templates**
   - Make sure templates are configured
   - Check if templates are using correct variables

## Common Issues

### Issue: Email Confirmation is Disabled
**Solution**: 
- If "Confirm email" is OFF, users can sign in immediately without confirmation
- Try signing in directly - it might work!

### Issue: Supabase Email Service Not Configured
**Solution**:
- Free tier Supabase uses their email service (should work by default)
- Check Supabase status page for email service issues
- Consider upgrading if you need custom SMTP

### Issue: Email Template Not Set Up
**Solution**:
- Go to **Authentication** → **Email Templates**
- Set up the "Confirm signup" template
- Use templates from `supabase/email-templates.md`

## Resend Confirmation Email

1. Go to `/auth/resend-confirmation`
2. Enter your email address
3. Click "Resend Confirmation Email"
4. Check your inbox again

## Alternative: Disable Email Confirmation (For Testing)

If you're just testing and don't need email confirmation:

1. Go to Supabase Dashboard
2. **Authentication** → **Providers** → **Email**
3. Turn **OFF** "Confirm email"
4. Save changes
5. Users can now sign in immediately after signup

## Check Email Status in Supabase

1. Go to **Authentication** → **Users**
2. Find your user by email
3. Check the "Email Confirmed" status
4. If it shows "Confirmed" but you didn't click a link, email confirmation might be disabled

## Still Not Working?

1. **Check Browser Console**
   - Open browser DevTools (F12)
   - Look for any errors in the Console tab
   - Check Network tab for failed requests

2. **Check Supabase Logs**
   - Go to **Logs** → **Auth Logs**
   - Look for email sending errors

3. **Test with Different Email**
   - Try signing up with a different email provider (Gmail, Outlook, etc.)
   - Some email providers block automated emails

4. **Verify Environment Variables**
   - Make sure `.env.local` has correct Supabase URL and key
   - Restart dev server after changing env vars

## Quick Test

Try signing in directly:
- If email confirmation is disabled, you can sign in immediately
- If it's enabled, you'll get an error saying email needs confirmation





