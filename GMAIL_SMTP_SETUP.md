# Gmail SMTP Setup for Supabase

## Configure Gmail SMTP in Supabase

1. **Go to Supabase Dashboard**
   - https://supabase.com/dashboard/project/jmlfvqoholffkegwfsyu
   - Navigate to **Settings** → **Auth** → **SMTP Settings**

2. **Fill in the SMTP Settings**:
   ```
   Host: smtp.gmail.com
   Port: 587
   Username: khamareclarke@gmail.com
   Password: ovga hgzy rltc ifyh
   Sender Email: khamareclarke@gmail.com
   Sender Name: Leverage Journal
   Minimum interval: 60 seconds
   ```

3. **Save Settings**

4. **Enable Email Provider**:
   - Go to **Authentication** → **Providers** → **Email**
   - Make sure Email is **ENABLED**
   - Set "Confirm email" to **OFF** (we'll use codes instead)

---

## Important Notes

- The password is a Gmail App Password (not your regular password)
- Make sure 2-Factor Authentication is enabled on the Gmail account
- Gmail has sending limits (~500 emails/day for free accounts)
- For production, consider using a dedicated email service

---

## Testing

After setup, test by:
1. Signing up a new user
2. Check email for verification code
3. Use code to sign in




