'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Cookie } from 'lucide-react';
import Link from 'next/link';

export default function SimpleCookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    
    // Initialize analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
        ad_storage: 'granted'
      });
    }
  };

  const rejectAll = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShowBanner(false);
    
    // Deny analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied',
        ad_storage: 'denied'
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 bg-black/95 backdrop-blur-xl border-t border-yellow-600/30 shadow-2xl">
      <div className="w-full px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <Cookie className="w-6 h-6 text-yellow-400 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-white text-sm">
                  <strong>🍪 We Value Your Privacy</strong> - We use cookies to enhance your experience. 
                  <Link href="/cookies" className="text-yellow-400 hover:text-yellow-300 underline ml-1">
                    Learn more
                  </Link>
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 flex-shrink-0">
              <Button
                onClick={acceptAll}
                size="sm"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold"
              >
                Accept All
              </Button>
              
              <Button
                onClick={rejectAll}
                size="sm"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Reject All
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
