'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, ArrowLeft, Mail, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function ResendConfirmation() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      // Resend confirmation email
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (resendError) {
        // If resend fails, try alternative method
        if (resendError.message.includes('already confirmed') || resendError.message.includes('already verified')) {
          setError('This email is already confirmed. You can sign in directly.');
        } else if (resendError.message.includes('not found')) {
          setError('No account found with this email. Please sign up first.');
        } else {
          setError(resendError.message || 'Failed to resend confirmation email. Please try again.');
        }
      } else {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
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
            <h1 className="text-3xl font-bold text-white">Resend Confirmation Email</h1>
            <p className="text-gray-400 mt-2">Didn't receive the email? We'll send it again</p>
          </div>
        </div>

        {/* Form */}
        <Card className="bg-neutral-900/50 border border-yellow-600/20 p-8">
          {success ? (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Email Sent!</h2>
              <p className="text-gray-400">
                We've sent a confirmation email to <strong>{email}</strong>.
                Please check your inbox (and spam folder) and click the confirmation link.
              </p>
              <div className="pt-4 space-y-2">
                <Link href="/auth/signin">
                  <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-3">
                    Go to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <p className="text-red-300 text-sm">{error}</p>
                    </div>
                  </div>
                )}

                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <p className="text-yellow-200 text-sm">
                    <strong>Not receiving emails?</strong>
                  </p>
                  <ul className="text-yellow-200/80 text-sm mt-2 space-y-1 list-disc list-inside">
                    <li>Check your spam/junk folder</li>
                    <li>Wait a few minutes - emails can be delayed</li>
                    <li>Verify the email address is correct</li>
                    <li>Check if email confirmation is enabled in Supabase</li>
                  </ul>
                </div>

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
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-3 transition-all duration-300"
                >
                  {loading ? 'Sending...' : 'Resend Confirmation Email'}
                </Button>
              </form>

              <div className="mt-6 text-center space-y-2">
                <Link href="/auth/signin" className="block text-yellow-400 hover:text-yellow-300 text-sm font-medium">
                  Back to Sign In
                </Link>
                <p className="text-gray-500 text-xs">
                  Already confirmed? <Link href="/auth/signin" className="text-yellow-400 hover:text-yellow-300">Sign in here</Link>
                </p>
              </div>
            </>
          )}
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





