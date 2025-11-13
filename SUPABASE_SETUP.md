# Supabase Authentication Setup Guide

## Overview

This project uses Supabase for authentication and user management. The authentication system includes:
- Secure sign-up and sign-in
- Session management with automatic token refresh
- Password reset functionality
- User profile metadata storage
- Row Level Security (RLS) policies

## Current Supabase Tables

Based on the check, you currently have:
- ✅ `users` table (Supabase Auth built-in)

## Required Setup

### 1. Create Environment Variables

Create a `.env.local` file in the root directory with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://jmlfvqoholffkegwfsyu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImptbGZ2cW9ob2xmZmtlZ3dmc3l1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIyNjU0NDMsImV4cCI6MjA3Nzg0MTQ0M30.UtJRavqqSNj6k39SI0KBlqF7PcBsSFxHxHuly9ZL5M8
```

### 2. Create Profiles Table

Run the migration SQL in your Supabase dashboard:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/migrations/001_create_profiles_table.sql`
4. Execute the SQL

This will create:
- `profiles` table for user metadata
- Row Level Security policies
- Automatic profile creation trigger on user signup
- Updated timestamp trigger

### 3. Verify Table Creation

Run the check script to verify tables:

```bash
npm run check-tables
```

You should see:
- ✅ `users` (Supabase Auth)
- ✅ `profiles` (after running migration)

## Features Implemented

### Authentication Context (`contexts/AuthContext.tsx`)
- ✅ Real-time session management
- ✅ Automatic session refresh
- ✅ User profile loading
- ✅ Sign in with email/password
- ✅ Sign up with email/password and optional name
- ✅ Sign out
- ✅ Password reset via email

### Pages
- ✅ `/auth/signin` - Sign in page
- ✅ `/auth/signup` - Sign up page with name field
- ✅ `/auth/reset-password` - Password reset page

### Database Schema

#### Profiles Table
```sql
- id (UUID, Primary Key, References auth.users)
- email (TEXT)
- name (TEXT)
- profile_complete (BOOLEAN, default: false)
- avatar_url (TEXT, optional)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## Security Features

1. **Row Level Security (RLS)**: Enabled on profiles table
2. **Policies**:
   - Users can only view their own profile
   - Users can only update their own profile
   - Users can only insert their own profile
3. **Automatic Profile Creation**: Trigger creates profile when user signs up
4. **Token-based Sessions**: Secure session management via Supabase Auth

## Usage

### Sign Up
```typescript
const { signUp } = useAuth();
await signUp('user@example.com', 'password123', 'John Doe');
```

### Sign In
```typescript
const { signIn } = useAuth();
await signIn('user@example.com', 'password123');
```

### Sign Out
```typescript
const { signOut } = useAuth();
await signOut();
```

### Reset Password
```typescript
const { resetPassword } = useAuth();
await resetPassword('user@example.com');
```

### Access Current User
```typescript
const { user, loading } = useAuth();
// user: { id, email, name, profileComplete }
```

## Next Steps

1. ✅ Run the migration SQL in Supabase dashboard
2. ✅ Test sign up flow
3. ✅ Test sign in flow
4. ✅ Test password reset flow
5. Configure email templates in Supabase dashboard (Settings > Auth > Email Templates)
6. Set up redirect URLs in Supabase dashboard (Settings > Auth > URL Configuration)

## Troubleshooting

### "Profile fetch error"
- Make sure the `profiles` table exists
- Check that RLS policies are set up correctly
- Verify the user has the correct permissions

### "Sign up failed"
- Check Supabase Auth settings
- Verify email confirmation is disabled (if testing) or configure email templates
- Check browser console for detailed error messages

### Session not persisting
- Verify environment variables are set correctly
- Check that cookies are enabled in browser
- Ensure Supabase client is configured with `persistSession: true`





