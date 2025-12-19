# Email Configuration Guide for Supabase

## For Development/Testing: Use Supabase's Built-in Email Service

**You DON'T need to configure SMTP for basic email sending!**

Supabase has a built-in email service that works out of the box. You only need custom SMTP if you want to:
- Use your own domain email
- Send from a custom email address
- Have more control over email delivery

---

## Option 1: Use Supabase's Built-in Email (Recommended for Development)

### Steps:

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard/project/jmlfvqoholffkegwfsyu
   - Navigate to **Settings** → **Auth**

2. **Leave SMTP Settings Empty**
   - Don't configure custom SMTP
   - Supabase will use their default email service
   - Emails will be sent from `noreply@mail.app.supabase.io` or similar

3. **Enable Email Provider**
   - Go to **Authentication** → **Providers** → **Email**
   - Make sure Email provider is **ENABLED**
   - Set "Confirm email" to **ON** or **OFF** (your choice)

4. **Set Up Email Templates**
   - Go to **Authentication** → **Email Templates**
   - Copy templates from `supabase/email-templates.md`
   - Paste into "Confirm signup" template
   - Save

**That's it!** Emails will work automatically.

---

## Option 2: Use Custom SMTP (For Production)

Only configure SMTP if you want to send from your own domain.

### Recommended SMTP Providers:

1. **SendGrid** (Free tier: 100 emails/day)
2. **Mailgun** (Free tier: 5,000 emails/month)
3. **Amazon SES** (Very cheap, pay per email)
4. **Gmail SMTP** (For testing only, not recommended for production)

### Example: Using Gmail SMTP (For Testing Only)

**⚠️ Warning: Gmail SMTP is not recommended for production!**

If you want to test with Gmail:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account → Security
   - Enable 2-Step Verification
   - Go to App Passwords
   - Generate password for "Mail"

3. **Configure in Supabase**:
   - **Host**: `smtp.gmail.com`
   - **Port**: `465` (SSL) or `587` (TLS)
   - **Username**: Your Gmail address
   - **Password**: The app password (not your regular password)
   - **Sender Email**: Your Gmail address
   - **Sender Name**: "Leverage Journal" (or your choice)

---

## Current Settings You're Seeing

The settings you showed are **default/placeholder values**. You need to either:

### A) Leave them empty (Use Supabase default)
- Don't fill in SMTP settings
- Supabase handles emails automatically
- Works for development/testing

### B) Fill them with real SMTP credentials
- Only if you want custom email domain
- Requires SMTP provider account
- More setup required

---

## Quick Setup for Your Project

**For now, I recommend:**

1. **Don't configure SMTP** - Leave it empty
2. **Enable Email Provider**:
   - Authentication → Providers → Email → Enable
3. **Set Email Confirmation**:
   - Turn **OFF** for testing (no emails needed)
   - Turn **ON** for production (emails will be sent)
4. **Set Up Templates**:
   - Authentication → Email Templates
   - Use templates from `supabase/email-templates.md`

---

## Testing Email

1. **If email confirmation is OFF**:
   - Sign up → Sign in immediately (no email needed)

2. **If email confirmation is ON**:
   - Sign up → Check email inbox
   - Check spam folder if not received
   - Click confirmation link

---

## Troubleshooting

### Not receiving emails?

1. **Check spam folder**
2. **Wait 2-5 minutes** (delivery delay)
3. **Check Supabase Logs**:
   - Go to **Logs** → **Auth Logs**
   - Look for email sending errors
4. **Verify email templates are set up**
5. **Try disabling email confirmation** (for testing)

### SMTP errors?

1. **Check credentials are correct**
2. **Verify port number** (465 for SSL, 587 for TLS)
3. **Check if SMTP provider allows your IP**
4. **Test with Supabase's default service first**

---

## Recommendation

**For development:**
- ✅ Use Supabase's built-in email (no SMTP needed)
- ✅ Disable email confirmation (sign in immediately)
- ✅ Test without emails

**For production:**
- ✅ Set up custom SMTP with your domain
- ✅ Enable email confirmation
- ✅ Use professional email templates
- ✅ Monitor email delivery

---

## Next Steps

1. **Right now**: Leave SMTP empty, use Supabase default
2. **For testing**: Disable email confirmation
3. **For production**: Set up proper SMTP later

The built-in service works fine for development and testing!





