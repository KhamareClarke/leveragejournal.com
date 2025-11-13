'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  name?: string;
  profileComplete?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name?: string) => Promise<{ requiresConfirmation?: boolean; email?: string } | void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session with timeout
    const checkSession = async () => {
      try {
        // Add timeout to prevent hanging
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error('Session check timeout')), 5000)
        );

        const sessionPromise = supabase.auth.getSession();
        
        let sessionResult: any;
        try {
          sessionResult = await Promise.race([
            sessionPromise,
            timeoutPromise
          ]);
        } catch (timeoutError) {
          console.error('Session check timeout:', timeoutError);
          setLoading(false);
          return;
        }
        
        const { data: { session }, error } = sessionResult;
        
        if (error) {
          console.error('Session check error:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          console.log('No session found');
        }
      } catch (error: any) {
        console.error('Auth check failed:', error);
        // Set loading to false even on error
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Get user profile from profiles table with timeout
      const profilePromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      // Add timeout to prevent hanging (3 seconds - reduced from 5)
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('Profile load timeout')), 3000)
      );

      let profile: any = null;
      let error: any = null;

      try {
        const result = await Promise.race([
          profilePromise,
          timeoutPromise
        ]);
        profile = (result as any)?.data;
        error = (result as any)?.error;
      } catch (timeoutError: any) {
        // Timeout or other error - use fallback
        console.warn('Profile load timeout or error, using fallback:', timeoutError.message);
        error = timeoutError;
      }

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Profile fetch error:', error);
      }

      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: profile?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0],
        profileComplete: profile?.profile_complete || false,
      };

      setUser(userData);
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Fallback to basic user data - don't let profile loading failure block sign-in
      setUser({
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0],
        profileComplete: false,
      });
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error(error.message || 'Sign in failed');
      }

      if (data.user) {
        await loadUserProfile(data.user);
      }
    } catch (error: any) {
      throw new Error(error.message || 'Sign in failed');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string) => {
    setLoading(true);
    try {
      console.log('Attempting signup for:', email);
      
      // Add timeout to prevent hanging
      const signupPromise = supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name || email.split('@')[0],
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      // Set a 10 second timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Signup request timed out. Please check your internet connection and try again.')), 10000)
      );

      const { data, error } = await Promise.race([signupPromise, timeoutPromise]) as any;

      console.log('Signup response:', { data, error });

      if (error) {
        console.error('Signup error details:', {
          message: error.message,
          status: error.status,
          name: error.name,
        });
        
        // Provide more helpful error messages
        if (error.message.toLowerCase().includes('signups') || 
            error.message.toLowerCase().includes('disabled') ||
            error.message.toLowerCase().includes('signup disabled')) {
          throw new Error(
            'Email signups are disabled. Please check your Supabase dashboard:\n\n' +
            '1. Go to Authentication → Providers\n' +
            '2. Find "Email" provider and make sure it\'s enabled\n' +
            '3. If "Confirm email" is ON, you can turn it OFF for testing\n' +
            '4. Save changes and try again'
          );
        }
        
        // Show the actual error message
        throw new Error(error.message || 'Sign up failed');
      }

      // Success - user was created
      if (data.user) {
        console.log('User created successfully:', data.user.id);
        
        // Profile creation - don't wait for it, let trigger handle it or do it in background
        // This prevents hanging if profile creation is slow
        const profileInsertPromise = supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            name: name || email.split('@')[0],
            profile_complete: false,
            created_at: new Date().toISOString(),
          });
        
        // Handle profile creation asynchronously (non-blocking)
        Promise.resolve(profileInsertPromise).then((result: any) => {
          const { error: profileError } = result;
          if (profileError) {
            console.error('Profile creation error (non-blocking):', profileError);
            // Profile might be created by trigger, so this is okay
          } else {
            console.log('Profile created successfully');
          }
        }).catch((profileErr) => {
          console.error('Profile creation error (non-blocking):', profileErr);
          // Continue anyway - profile might be created by trigger
        });

        // Check if session exists (email confirmation disabled) or not (email confirmation required)
        if (data.session) {
          console.log('Session exists - user is logged in');
          // Load profile in background, don't wait for it
          loadUserProfile(data.user).catch(err => {
            console.error('Profile load error (non-blocking):', err);
            // Set basic user data if profile load fails
            setUser({
              id: data.user.id,
              email: data.user.email || email,
              name: name || email.split('@')[0],
              profileComplete: false,
            });
          });
        } else {
          console.log('No session - email confirmation required');
          // Email confirmation required - return immediately
          return { requiresConfirmation: true, email };
        }
      } else {
        // This shouldn't happen, but handle it
        console.warn('User created but no user object returned');
        throw new Error('Account creation initiated. Please check your email for confirmation.');
      }
    } catch (error: any) {
      console.error('Signup catch error:', error);
      throw new Error(error.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
      }
      setUser(null);
    } catch (error: any) {
      throw new Error(error.message || 'Sign out failed');
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw new Error(error.message || 'Password reset failed');
      }
    } catch (error: any) {
      throw new Error(error.message || 'Password reset failed');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
