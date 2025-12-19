import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for server-side operations (bypasses RLS)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Use regular client for auth operations
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: 'Email and code are required' },
        { status: 400 }
      );
    }

    // Find valid code (use admin client to bypass RLS)
    const { data: codeData, error: findError } = await supabaseAdmin
      .from('verification_codes')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('code', code)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (findError || !codeData) {
      return NextResponse.json(
        { error: 'Invalid or expired code. Please request a new code.' },
        { status: 400 }
      );
    }

    // Get password and name from code data (stored during signup)
    const userPassword = codeData.password_hash || codeData.password;
    const userName = codeData.name;
    
    if (!userPassword) {
      return NextResponse.json(
        { 
          error: 'Password not found. Please sign up again.',
          details: 'The password_hash column may be missing. Run this SQL in Supabase Dashboard → SQL Editor:\n\nALTER TABLE public.verification_codes ADD COLUMN IF NOT EXISTS password_hash TEXT;\nALTER TABLE public.verification_codes ADD COLUMN IF NOT EXISTS name TEXT;'
        },
        { status: 400 }
      );
    }

    // Mark code as used (use admin client)
    await supabaseAdmin
      .from('verification_codes')
      .update({ used: true })
      .eq('id', codeData.id);

    // Create account and sign in immediately (no email link needed)
    // Use admin API to create user and session directly (fastest method)
    
    let session = null;
    let user = null;

    // Check if user exists first using admin API (with timeout)
    const listUsersPromise = supabaseAdmin.auth.admin.listUsers();
    const listUsersTimeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('listUsers timed out after 5 seconds')), 5000)
    );

    let usersList;
    let listError;
    try {
      const result = await Promise.race([listUsersPromise, listUsersTimeout]) as any;
      usersList = result.data;
      listError = result.error;
    } catch (timeoutErr: any) {
      return NextResponse.json(
        { 
          error: 'Request timed out. Please check your SUPABASE_SERVICE_ROLE_KEY in .env.local',
          details: 'The service role key is required for admin operations.'
        },
        { status: 500 }
      );
    }

    const existingUser = usersList?.users?.find((u: any) => u.email?.toLowerCase() === email.toLowerCase());

    if (existingUser) {
      // User exists - update password and sign in
      try {
        // If password was provided in code, update user's password
        if (userPassword) {
          await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
            password: userPassword, // Update password with the one from signup
            email_confirm: true,
          });
          
          // Update name if provided
          if (userName) {
            await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
              user_metadata: {
                ...existingUser.user_metadata,
                name: userName,
              },
            });
          }
          
          // Sign in with the updated password
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: email.toLowerCase(),
            password: userPassword,
          });
          
          if (signInData?.session && signInData?.user) {
            session = signInData.session;
            user = signInData.user;
          } else {
            // Fallback to magic link
            const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
              type: 'magiclink',
              email: email.toLowerCase(),
            });
            
            if (linkData?.properties?.hashed_token) {
              const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
                token_hash: linkData.properties.hashed_token,
                type: 'magiclink',
              });
              
              if (verifyData?.session && verifyData?.user) {
                session = verifyData.session;
                user = verifyData.user;
              } else {
                return NextResponse.json(
                  { 
                    error: 'Failed to sign in.',
                    details: `Password sign-in failed: ${signInError?.message || 'unknown'}. Magic link also failed: ${verifyError?.message || 'unknown'}`
                  },
                  { status: 500 }
                );
              }
            } else {
              return NextResponse.json(
                { 
                  error: 'Failed to sign in.',
                  details: `Password sign-in failed: ${signInError?.message || 'unknown'}`
                },
                { status: 500 }
              );
            }
          }
        } else {
          // No password provided - use magic link (for existing users signing in)
          await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
            email_confirm: true,
          });
          
          const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: email.toLowerCase(),
          });
          
          if (linkData?.properties?.hashed_token) {
            const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: linkData.properties.hashed_token,
              type: 'magiclink',
            });
            
            if (verifyData?.session && verifyData?.user) {
              session = verifyData.session;
              user = verifyData.user;
            } else {
              return NextResponse.json(
                { 
                  error: 'Failed to sign in.',
                  details: verifyError?.message || 'Token verification failed'
                },
                { status: 500 }
              );
            }
          } else {
            return NextResponse.json(
              { 
                error: 'Failed to create session.',
                details: linkError?.message || 'Could not generate link'
              },
              { status: 500 }
            );
          }
        }

        // Ensure profile exists for existing user
        try {
          const { data: existingProfile, error: profileCheckError } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('id', existingUser.id)
            .single();

          if (profileCheckError || !existingProfile) {
            // Profile doesn't exist, create it
            const { error: profileCreateError } = await supabaseAdmin
              .from('profiles')
              .insert({
                id: existingUser.id,
                email: email.toLowerCase(),
                name: userName || existingUser.user_metadata?.name || email.split('@')[0],
                profile_complete: false,
              });

            // Profile creation attempted
          } else if (userName) {
            // Update name if provided
            await supabaseAdmin
              .from('profiles')
              .update({ name: userName })
              .eq('id', existingUser.id);
          }
        } catch (profileErr: any) {
          // Profile error - continue anyway
        }
      } catch (err: any) {
        return NextResponse.json(
          { 
            error: 'Failed to create session.',
            details: err.message || 'Unknown error. Please check server logs.'
          },
          { status: 500 }
        );
      }
    } else {
      // New user - create account with the password they provided during signup
      
      // This check is redundant now (we check above), but keep for safety
      if (!userPassword) {
        return NextResponse.json(
          { 
            error: 'Password not found. Please sign up again.',
            details: 'The password_hash column may be missing. Run this SQL in Supabase Dashboard → SQL Editor:\n\nALTER TABLE public.verification_codes ADD COLUMN IF NOT EXISTS password_hash TEXT;\nALTER TABLE public.verification_codes ADD COLUMN IF NOT EXISTS name TEXT;'
          },
          { status: 400 }
        );
      }
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password: userPassword, // Use the password from signup
        options: {
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
          data: {
            verified_by_code: true,
            name: userName || email.split('@')[0],
          },
        },
      });

      if (signUpError) {
        // Check for specific error types
        let errorDetails = '';
        
        if (signUpError.message?.includes('Signups not allowed') || signUpError.message?.includes('signups_disabled')) {
          errorDetails = 'Signups are disabled in Supabase. Go to: Authentication → Settings → Enable "Enable sign ups"';
        } else if (signUpError.message?.includes('Email not confirmed') || signUpError.message?.includes('email_not_confirmed')) {
          errorDetails = 'Email confirmation is enabled. Go to: Authentication → Providers → Email → Turn OFF "Confirm email"';
        } else if (signUpError.message?.includes('Email logins are disabled') || signUpError.message?.includes('email_provider_disabled')) {
          errorDetails = 'Email provider is disabled. Go to: Authentication → Providers → Email → Enable the Email provider';
        } else {
          errorDetails = signUpError.message || 'Failed to create account';
        }
        
        return NextResponse.json(
          { 
            error: 'Failed to create account',
            details: errorDetails
          },
          { status: 500 }
        );
      }

      if (signUpData?.user) {
        // Confirm email immediately using admin API
        await supabaseAdmin.auth.admin.updateUserById(signUpData.user.id, {
          email_confirm: true,
        });

        // Ensure profile is created in profiles table (trigger should handle this, but ensure it exists)
        try {
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .upsert({
              id: signUpData.user.id,
              email: email.toLowerCase(),
              name: userName || signUpData.user.user_metadata?.name || email.split('@')[0],
              profile_complete: false,
            }, {
              onConflict: 'id'
            });

          // Profile creation attempted - continue anyway
        } catch (profileErr: any) {
          // Profile error - continue anyway
        }

        // Sign in with the password they provided
        // Try to sign in with password
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.toLowerCase(),
          password: userPassword,
        });

        if (signInData?.session && signInData?.user) {
          session = signInData.session;
          user = signInData.user;
        } else if (signUpData.session) {
          // Fallback: use session from signup if password sign-in fails
          session = signUpData.session;
          user = signUpData.user;
        } else {
          // Last resort: try magic link
          const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: email.toLowerCase(),
          });
          
          if (linkData?.properties?.hashed_token) {
            const { data: verifyData, error: verifyError } = await supabase.auth.verifyOtp({
              token_hash: linkData.properties.hashed_token,
              type: 'magiclink',
            });
            
            if (verifyData?.session && verifyData?.user) {
              session = verifyData.session;
              user = verifyData.user;
            } else {
              return NextResponse.json(
                { 
                  error: 'Failed to sign in.',
                  details: `Password sign-in failed: ${signInError?.message || 'unknown'}. Magic link also failed: ${verifyError?.message || 'unknown'}. Please try signing in manually.`
                },
                { status: 500 }
              );
            }
          } else {
            return NextResponse.json(
              { 
                error: 'Failed to sign in.',
                details: `Password sign-in failed: ${signInError?.message || 'unknown'}. Please try signing in manually with your email and password.`
              },
              { status: 500 }
            );
          }
        }
      }
    }


    // Return session if we have it
    if (session && user) {
      return NextResponse.json({
        success: true,
        message: 'Code verified! Account created and signed in successfully.',
        session: {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_in: session.expires_in,
          expires_at: session.expires_at,
          token_type: session.token_type,
        },
        user: {
          id: user.id,
          email: user.email,
          user_metadata: user.user_metadata,
        },
      });
    }

    // If we get here, something went wrong
    return NextResponse.json(
      { 
        error: 'Failed to create account or sign in. Please disable email confirmation in Supabase.',
        details: 'Code was verified but account creation/sign-in failed. Go to: Authentication → Providers → Email → Turn OFF "Confirm email"'
      },
      { status: 500 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: error.message || 'Failed to verify code',
        details: 'Please check server logs and disable email confirmation in Supabase'
      },
      { status: 500 }
    );
  }
}

