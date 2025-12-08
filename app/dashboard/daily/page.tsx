'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function DailyPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      // Preserve the full URL including query parameters
      const currentPath = typeof window !== 'undefined' 
        ? window.location.pathname + window.location.search 
        : '/dashboard/daily';
      router.push(`/auth/signin?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [user, authLoading, router]);

  // Redirect to dashboard with daily tab
  useEffect(() => {
    if (!authLoading && user) {
      router.push('/dashboard?tab=do');
    }
  }, [user, authLoading, router]);

  // Early return - don't render anything if not authenticated or still loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  return null; // Will redirect to dashboard
}
