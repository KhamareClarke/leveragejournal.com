'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

/**
 * This page helps redirect from old localhost URLs to the correct success page
 * If someone has a session_id from a checkout that redirected to localhost,
 * they can use this page to redirect to the proper success page
 */
export default function SuccessRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (sessionId) {
      // Redirect to the success page with the session ID
      router.replace(`/checkout/success?session_id=${sessionId}`);
    } else {
      // If no session ID, redirect to home
      router.replace('/');
    }
  }, [sessionId, router]);

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-xl mb-4">Redirecting to success page...</p>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#f1cb32] mx-auto"></div>
      </div>
    </main>
  );
}
