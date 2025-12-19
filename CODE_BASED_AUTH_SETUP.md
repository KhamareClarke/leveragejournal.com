# Code-Based Authentication Setup

## Overview

This system uses **verification codes** instead of passwords:
1. User enters email on signup
2. System sends 6-digit code to email
3. User enters code to sign in
4. If code matches, user is signed in successfully

---

## Setup Steps

### 1. Add Email Credentials to .env.local

Add these to your `.env.local` file:

```env
EMAIL_USER=khamareclarke@gmail.com
EMAIL_PASS=ovga hgzy rltc ifyh
```

### 2. Install Dependencies

```bash
npm install nodemailer @types/nodemailer
```

### 3. Run Database Migration

Go to Supabase Dashboard → SQL Editor and run:

```sql
-- Copy contents from supabase/migrations/002_create_verification_codes_table.sql
```

This creates the `verification_codes` table.

### 4. Configure Gmail SMTP (Optional - for Supabase)

If you want to use Supabase's email service too:

1. Go to **Settings** → **Auth** → **SMTP Settings**
2. Fill in:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - Username: `khamareclarke@gmail.com`
   - Password: `ovga hgzy rltc ifyh`
   - Sender Email: `khamareclarke@gmail.com`
   - Sender Name: `Leverage Journal`

---

## How It Works

### Signup Flow:
1. User enters email on `/auth/signup`
2. System generates 6-digit code
3. Code is stored in database (expires in 10 minutes)
4. Code is sent via email using Gmail SMTP
5. User is redirected to `/auth/verify-code`

### Signin Flow:
1. User enters email and code on `/auth/verify-code`
2. System verifies code matches and hasn't expired
3. If valid, creates/updates user account
4. Signs user in and redirects to dashboard

---

## Files Created

- `lib/email.ts` - Email sending function using Gmail SMTP
- `app/api/auth/send-code/route.ts` - API to send verification code
- `app/api/auth/verify-code/route.ts` - API to verify code
- `app/auth/verify-code/page.tsx` - Page to enter verification code
- `supabase/migrations/002_create_verification_codes_table.sql` - Database table

---

## Testing

1. Go to `/auth/signup`
2. Enter email address
3. Click "Create Account"
4. Check email for 6-digit code
5. Go to `/auth/verify-code` (or you'll be redirected)
6. Enter email and code
7. Click "Verify & Sign In"
8. You'll be signed in and redirected to dashboard

---

## Troubleshooting

### Email not sending?
- Check `.env.local` has `EMAIL_USER` and `EMAIL_PASS`
- Verify Gmail app password is correct
- Check Gmail account has 2FA enabled
- Check spam folder

### Code not working?
- Codes expire in 10 minutes
- Each code can only be used once
- Make sure you're using the latest code sent

### Database errors?
- Make sure `verification_codes` table exists
- Run the migration SQL in Supabase dashboard

---

## Security Notes

- Codes expire in 10 minutes
- Codes can only be used once
- Codes are stored securely in database
- Email is sent via secure SMTP (TLS)

---

## Next Steps

1. ✅ Add email credentials to `.env.local`
2. ✅ Install nodemailer: `npm install nodemailer @types/nodemailer`
3. ✅ Run database migration
4. ✅ Test signup flow
5. ✅ Test signin with code

The system is ready to use!





