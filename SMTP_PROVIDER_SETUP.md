# SMTP Provider Setup Guide

## You DON'T Need Your Own Host/IP!

You need to use an **SMTP Provider Service** (not your own server). Here are free/cheap options:

---

## Option 1: SendGrid (Recommended - Free Tier)

### Free Tier: 100 emails/day

1. **Sign up**: https://sendgrid.com
2. **Create API Key**:
   - Go to Settings → API Keys
   - Create new API Key
   - Copy the key

3. **Configure in Supabase**:
   - **Host**: `smtp.sendgrid.net`
   - **Port**: `587` (or `465` for SSL)
   - **Username**: `apikey` (literally type "apikey")
   - **Password**: Your SendGrid API key
   - **Sender Email**: Your verified email in SendGrid
   - **Sender Name**: "Leverage Journal"

---

## Option 2: Mailgun (Free Tier)

### Free Tier: 5,000 emails/month

1. **Sign up**: https://www.mailgun.com
2. **Get SMTP Credentials**:
   - Go to Sending → Domain Settings
   - Find SMTP credentials

3. **Configure in Supabase**:
   - **Host**: `smtp.mailgun.org`
   - **Port**: `587`
   - **Username**: From Mailgun dashboard
   - **Password**: From Mailgun dashboard
   - **Sender Email**: Your verified domain email
   - **Sender Name**: "Leverage Journal"

---

## Option 3: Amazon SES (Cheapest)

### Pay per email (~$0.10 per 1,000 emails)

1. **Sign up**: AWS account → Amazon SES
2. **Verify Email/Domain**
3. **Get SMTP Credentials**:
   - Create SMTP credentials in SES console

4. **Configure in Supabase**:
   - **Host**: `email-smtp.[region].amazonaws.com` (e.g., `email-smtp.us-east-1.amazonaws.com`)
   - **Port**: `587`
   - **Username**: Your SES SMTP username
   - **Password**: Your SES SMTP password
   - **Sender Email**: Your verified email
   - **Sender Name**: "Leverage Journal"

---

## Option 4: Gmail SMTP (Testing Only - NOT Recommended)

⚠️ **Only for testing, not production!**

1. **Enable 2FA** on Gmail account
2. **Generate App Password**:
   - Google Account → Security → App Passwords
   - Create password for "Mail"

3. **Configure in Supabase**:
   - **Host**: `smtp.gmail.com`
   - **Port**: `587` (TLS) or `465` (SSL)
   - **Username**: Your Gmail address
   - **Password**: The app password (not your regular password)
   - **Sender Email**: Your Gmail address
   - **Sender Name**: "Leverage Journal"

---

## Quick Setup Steps

### 1. Choose a Provider
- **For testing**: Gmail SMTP (quick setup)
- **For production**: SendGrid or Mailgun (free tiers)

### 2. Get SMTP Credentials
- Sign up for the provider
- Get SMTP host, port, username, password

### 3. Configure in Supabase
- Go to **Settings** → **Auth** → **SMTP Settings**
- Fill in:
  - **Host**: From provider (e.g., `smtp.sendgrid.net`)
  - **Port**: Usually `587` or `465`
  - **Username**: From provider
  - **Password**: From provider
  - **Sender Email**: Your verified email
  - **Sender Name**: "Leverage Journal"
  - **Minimum interval**: `60` seconds (default)

### 4. Test
- Try signing up a test user
- Check if email is received

---

## Recommended: SendGrid (Easiest)

1. **Sign up**: https://sendgrid.com/free/
2. **Verify your email** in SendGrid
3. **Create API Key**:
   - Settings → API Keys → Create API Key
   - Give it "Mail Send" permissions
   - Copy the key

4. **In Supabase**:
   ```
   Host: smtp.sendgrid.net
   Port: 587
   Username: apikey
   Password: [paste your SendGrid API key here]
   Sender Email: [your verified email]
   Sender Name: Leverage Journal
   ```

5. **Save** and test!

---

## What You DON'T Need

❌ Your own server
❌ Your own IP address
❌ Your own domain (for basic setup)
❌ Complex configuration

✅ Just an SMTP provider account (free options available)

---

## For Development: You Can Skip This!

If you're just testing:
- **Disable email confirmation** in Supabase
- Users can sign in immediately
- No emails needed
- Set up SMTP later for production

---

## Next Steps

1. **Choose a provider** (SendGrid recommended)
2. **Sign up and get credentials**
3. **Configure in Supabase SMTP settings**
4. **Test with a signup**

The built-in service works fine for development, but if you need higher limits, use one of these providers!





