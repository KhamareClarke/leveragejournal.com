# Supabase Email Templates

## Email Confirmation Template

### Subject
```
Confirm your Leverage Journal account
```

### Body (HTML)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm Your Account</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: #000; margin: 0; font-size: 28px; font-weight: bold;">Leverage Journal™</h1>
  </div>
  
  <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px;">Welcome to Your Transformation Journey!</h2>
    
    <p style="color: #666; font-size: 16px; margin: 20px 0;">
      Thank you for signing up for Leverage Journal™! We're excited to help you transform your life in 90 days.
    </p>
    
    <p style="color: #666; font-size: 16px; margin: 20px 0;">
      To get started, please confirm your email address by clicking the button below:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #000; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);">
        Confirm Email Address
      </a>
    </div>
    
    <p style="color: #999; font-size: 14px; margin: 30px 0 0 0;">
      Or copy and paste this link into your browser:
    </p>
    <p style="color: #4a90e2; font-size: 12px; word-break: break-all; margin: 10px 0;">
      {{ .ConfirmationURL }}
    </p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    
    <p style="color: #999; font-size: 12px; margin: 20px 0 0 0;">
      If you didn't create an account with Leverage Journal™, you can safely ignore this email.
    </p>
    
    <p style="color: #999; font-size: 12px; margin: 10px 0;">
      This link will expire in 24 hours for security reasons.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
    <p>© 2024 Leverage Journal™. All rights reserved.</p>
  </div>
</body>
</html>
```

### Body (Plain Text)
```
Welcome to Leverage Journal™!

Thank you for signing up! We're excited to help you transform your life in 90 days.

To get started, please confirm your email address by clicking the link below:

{{ .ConfirmationURL }}

If you didn't create an account with Leverage Journal™, you can safely ignore this email.

This link will expire in 24 hours for security reasons.

© 2024 Leverage Journal™. All rights reserved.
```

---

## Password Reset Template

### Subject
```
Reset your Leverage Journal password
```

### Body (HTML)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
  <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: #000; margin: 0; font-size: 28px; font-weight: bold;">Leverage Journal™</h1>
  </div>
  
  <div style="background: white; padding: 40px; border-radius: 0 0 10px 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <h2 style="color: #1a1a1a; margin-top: 0; font-size: 24px;">Reset Your Password</h2>
    
    <p style="color: #666; font-size: 16px; margin: 20px 0;">
      We received a request to reset your password for your Leverage Journal™ account.
    </p>
    
    <p style="color: #666; font-size: 16px; margin: 20px 0;">
      Click the button below to create a new password:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); color: #000; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(251, 191, 36, 0.3);">
        Reset Password
      </a>
    </div>
    
    <p style="color: #999; font-size: 14px; margin: 30px 0 0 0;">
      Or copy and paste this link into your browser:
    </p>
    <p style="color: #4a90e2; font-size: 12px; word-break: break-all; margin: 10px 0;">
      {{ .ConfirmationURL }}
    </p>
    
    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    
    <p style="color: #999; font-size: 12px; margin: 20px 0 0 0;">
      If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
    </p>
    
    <p style="color: #999; font-size: 12px; margin: 10px 0;">
      This link will expire in 1 hour for security reasons.
    </p>
  </div>
  
  <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
    <p>© 2024 Leverage Journal™. All rights reserved.</p>
  </div>
</body>
</html>
```

### Body (Plain Text)
```
Reset Your Password

We received a request to reset your password for your Leverage Journal™ account.

Click the link below to create a new password:

{{ .ConfirmationURL }}

If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.

This link will expire in 1 hour for security reasons.

© 2024 Leverage Journal™. All rights reserved.
```

---

## How to Set Up in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Email Templates**
3. Select the template you want to customize:
   - **Confirm signup** - For email confirmation
   - **Reset password** - For password reset
4. Copy and paste the HTML template into the editor
5. Replace `{{ .ConfirmationURL }}` with `{{ .ConfirmationURL }}` (Supabase will automatically replace this)
6. Save the template
7. Test by signing up a new user

## Variables Available

- `{{ .ConfirmationURL }}` - The confirmation/reset link
- `{{ .Email }}` - User's email address
- `{{ .Token }}` - The confirmation token (if needed)
- `{{ .TokenHash }}` - Hashed token (if needed)




