'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, ArrowLeft, Mail, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function VerifyCode() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);

  useEffect(() => {
    // Get email from URL params if available
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [searchParams]);

  const handleSendCode = async () => {
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setSendingCode(true);
    setError('');

    try {
      const response = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send code');
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to send code');
    } finally {
      setSendingCode(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !code) {
      setError('Please enter both email and code');
      setLoading(false);
      return;
    }

    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const data = await response.json();
      
      console.log('Response received:', { success: data.success, hasSession: !!data.session });

      if (!response.ok) {
        // Show detailed error message
        const errorMsg = data.details ? `${data.error}\n\n${data.details}` : data.error;
        throw new Error(errorMsg);
      }

      // Code verified successfully
      if (data.success && data.session) {
        console.log('Session received, setting in background and redirecting...');
        
        // Clear loading immediately
        setLoading(false);
        
        // Set session in background (don't wait for it)
        supabase.auth.setSession({
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        }).then((result) => {
          console.log('Session set in background:', result.data?.user?.id);
        }).catch((err) => {
          console.error('Background session error (non-blocking):', err);
        });
        
        // Redirect immediately - don't wait for setSession
        window.location.href = '/dashboard';
        return; // Exit early
      } else {
        console.error('Invalid response:', data);
        setLoading(false);
        throw new Error(data.error || 'Code verified but session not created. Please try again.');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please check:\n\n1. Email confirmation is disabled in Supabase\n2. Your internet connection\n3. Try again');
      } else {
        setError(err.message || 'Failed to verify code');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 text-black" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
              Leverage Journal™
            </span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Enter Verification Code</h1>
            <p className="text-gray-400 mt-2">Enter the code sent to your email</p>
          </div>
        </div>

        {/* Form */}
        <Card className="bg-neutral-900/50 border border-yellow-600/20 p-8">
          {success && (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 mb-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-300 text-sm">Code sent! Check your email.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleVerifyCode} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-300 text-sm whitespace-pre-line">{error}</p>
                {error.includes('email confirmation') && (
                  <div className="mt-2 text-xs text-yellow-300">
                    💡 Go to Supabase Dashboard → Authentication → Providers → Email → Turn OFF "Confirm email"
                  </div>
                )}
                {error.includes('Invalid or expired') && (
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={sendingCode}
                    className="mt-2 text-yellow-400 hover:text-yellow-300 text-sm underline"
                  >
                    {sendingCode ? 'Sending...' : 'Resend Code'}
                  </button>
                )}
              </div>
            )}
            
            {success && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <p className="text-green-300 text-sm">Code sent successfully! Check your email.</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 pl-12 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="Enter your email"
                  required
                  readOnly={!!searchParams.get('email')} // Read-only if email came from signup
                />
              </div>
              {!searchParams.get('email') && (
                <p className="text-gray-500 text-xs mt-2">
                  Code should already be sent. If you didn't receive it, click "Resend Code" below.
                </p>
              )}
            </div>

            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
                Verification Code
              </label>
              <input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white text-center text-2xl font-bold tracking-widest focus:outline-none focus:border-yellow-500 transition-colors"
                placeholder="000000"
                maxLength={6}
                required
              />
              <p className="text-gray-500 text-xs mt-2 text-center">
                Enter the 6-digit code from your email
              </p>
            </div>

            <Button
              type="submit"
              disabled={loading || !email || !code}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span>
                  Verifying & Signing In...
                </span>
              ) : (
                'Verify & Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button
              type="button"
              onClick={handleSendCode}
              disabled={sendingCode || !email}
              className="text-yellow-400 hover:text-yellow-300 text-sm font-medium underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {sendingCode ? 'Sending...' : 'Resend Code'}
            </button>
            <div className="mt-2">
              <Link href="/auth/signin" className="block text-gray-400 hover:text-yellow-400 text-sm">
                Back to Sign In
              </Link>
            </div>
          </div>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-gray-400 hover:text-yellow-400 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

