import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { sendVerificationCode } from '@/lib/email';

// Use service role key for server-side operations (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Generate a 6-digit verification code
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if email already exists (for uniqueness - prevent duplicate signups)
    // Only check if password is provided (signup), not for sign-in
    if (password) {
      const { data: existingUsers, error: checkError } = await supabase.auth.admin.listUsers();
      
      if (!checkError && existingUsers?.users) {
        const emailExists = existingUsers.users.some(
          (u: any) => u.email?.toLowerCase() === email.toLowerCase()
        );
        
        if (emailExists) {
          return NextResponse.json(
            { error: 'Email already exists' },
            { status: 400 }
          );
        }
      }
    }
    // If no password, it's a sign-in request - allow sending code

    // Generate verification code
    const code = generateCode();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // Code expires in 10 minutes

    // Store code in database with password and name (will be used after verification)
    const insertData: any = {
      email: email.toLowerCase(),
      code: code,
      expires_at: expiresAt.toISOString(),
      used: false,
    };
    
    // Add password if provided (for new signups)
    if (password) {
      insertData.password_hash = password;
    }
    
    // Add name if provided
    if (name) {
      insertData.name = name;
    }
    
    const { error: dbError } = await supabase
      .from('verification_codes')
      .insert(insertData);

    if (dbError) {
      // If column doesn't exist error, provide clear instructions
      if (dbError.message?.includes('column') && dbError.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Database column missing. Please run the migration.',
            details: 'Run this SQL in Supabase Dashboard → SQL Editor:\n\nALTER TABLE public.verification_codes ADD COLUMN IF NOT EXISTS password_hash TEXT;\nALTER TABLE public.verification_codes ADD COLUMN IF NOT EXISTS name TEXT;'
          },
          { status: 500 }
        );
      }
      
      // Provide helpful error message if table doesn't exist
      if (dbError.message?.includes('relation') && dbError.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Verification codes table not found. Please run the database migration first.',
            details: 'Go to Supabase Dashboard → SQL Editor → Run the SQL from supabase/migrations/002_create_verification_codes_table.sql'
          },
          { status: 500 }
        );
      }
      
      // Return detailed error for debugging
      return NextResponse.json(
        { 
          error: 'Failed to create verification code',
          details: dbError.message || 'Database error occurred',
          code: dbError.code,
          hint: dbError.hint,
          fullError: process.env.NODE_ENV === 'development' ? JSON.stringify(dbError, null, 2) : undefined
        },
        { status: 500 }
      );
    }

    // Send email with code
    try {
      await sendVerificationCode(email, code);
    } catch (emailError: any) {
      return NextResponse.json(
        { error: 'Failed to send email. Please check SMTP configuration.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
      // In development, return code for testing
      ...(process.env.NODE_ENV === 'development' && { code }),
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to send verification code' },
      { status: 500 }
    );
  }
}

