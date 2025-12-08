'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

export default function SignIn() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check if user just registered
    const registered = searchParams.get('registered');
    const registeredEmail = searchParams.get('email');
    
    if (registered === 'true' && registeredEmail) {
      setSuccessMessage(`Account created! Please check your email (${registeredEmail}) to confirm your account before signing in.`);
      setEmail(registeredEmail);
      // Clear the URL params
      router.replace('/auth/signin', { scroll: false });
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Sign in request timed out. Please try again.')), 15000)
      );
      
      await Promise.race([
        signIn(email, password),
        timeoutPromise
      ]);
      
      // Immediately redirect - don't wait for profile loading
      // The dashboard will handle loading states
      const redirect = searchParams.get('redirect') || searchParams.get('next');
      
      // Redirect to the originally requested page, or dashboard as fallback
      if (redirect) {
        router.push(redirect);
      } else {
        router.push('/dashboard');
      }
      
      // Don't reset loading here - let redirect happen
    } catch (err: any) {
      console.error('Sign in error:', err);
      setError(err.message || 'Invalid email or password. Please try again.');
      setIsLoading(false);
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
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400 mt-2">Sign in to continue your transformation journey</p>
          </div>
        </div>

        {/* Sign In Form */}
        <Card className="bg-neutral-900/50 border border-yellow-600/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {successMessage && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-green-300 text-sm">{successMessage}</p>
                    <div className="mt-2 space-y-1">
                      <Link 
                        href="/auth/resend-confirmation" 
                        className="text-yellow-400 hover:text-yellow-300 text-xs inline-block underline mr-3"
                      >
                        Didn't receive email? Resend it
                      </Link>
                      <p className="text-yellow-200/70 text-xs">
                        Or try signing in directly - email confirmation might be disabled
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-4 py-3 pr-12 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-3 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <div className="text-center">
              <p className="text-gray-400">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-yellow-400 hover:text-yellow-300 font-medium">
                  Sign up here
                </Link>
              </p>
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
