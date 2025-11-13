# Using Supabase's Built-in Email Service

## Important: No SMTP Configuration Needed!

**Supabase's built-in email service does NOT require SMTP settings.**

You **cannot** configure it with host/IP because it's handled internally by Supabase.

---

## How to Use Built-in Email (No SMTP Setup)

### Step 1: Leave SMTP Settings EMPTY
- Go to **Settings** → **Auth** → **SMTP Settings**
- **Don't fill anything in**
- Leave all fields empty
- Supabase will use their built-in service automatically

### Step 2: Enable Email Provider
- Go to **Authentication** → **Providers** → **Email**
- Make sure Email provider is **ENABLED**
- Set "Confirm email" to **ON** or **OFF**

### Step 3: Set Up Email Templates
- Go to **Authentication** → **Email Templates**
- Copy templates from `supabase/email-templates.md`
- Paste into "Confirm signup" template
- Save

**That's it!** Emails will work automatically.

---

## Why You're Seeing "Custom SMTP Required"

The message "Custom SMTP provider is required" appears when:
- You're trying to **change email rate limits**
- The built-in service has fixed limits
- To increase limits, you need custom SMTP

**But for basic email sending, you DON'T need custom SMTP!**

---

## Built-in Email Service Details

- **No configuration needed** - Works automatically
- **Fixed rate limits** - Can't be changed (this is why you see the message)
- **No SMTP settings** - Handled by Supabase internally
- **Works out of the box** - Just enable email provider

---

## Solution

**For development/testing:**
1. ✅ Leave SMTP settings **EMPTY**
2. ✅ Enable Email provider
3. ✅ Use built-in service (automatic)
4. ✅ Or disable email confirmation (sign in immediately)

**The built-in service works fine - you just can't change the rate limits without custom SMTP.**

---

## If You Really Need Higher Limits

Only then set up custom SMTP (SendGrid, Mailgun, etc.) as shown in `SMTP_PROVIDER_SETUP.md`.

But for most use cases, the built-in service is sufficient!

---

## Summary

- ❌ **Don't** fill in SMTP settings for built-in service
- ✅ **Leave** SMTP settings empty
- ✅ **Enable** Email provider
- ✅ **Use** built-in service automatically

**Supabase doesn't give you host/IP for built-in service - it's automatic!**




