'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cookie, Settings, X, Check } from 'lucide-react';
import Link from 'next/link';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true,
    analytics: false,
    marketing: false,
    personalization: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookieConsent');
    const savedPreferences = localStorage.getItem('cookiePreferences');
    
    if (!consent) {
      // Show banner after a short delay
      setTimeout(() => setShowBanner(true), 2000);
    }
    
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      personalization: true
    };
    
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookiePreferences', JSON.stringify(allAccepted));
    setPreferences(allAccepted);
    setShowBanner(false);
    
    // Initialize tracking scripts
    initializeTracking(allAccepted);
  };

  const acceptSelected = () => {
    localStorage.setItem('cookieConsent', 'customized');
    localStorage.setItem('cookiePreferences', JSON.stringify(preferences));
    setShowBanner(false);
    setShowSettings(false);
    
    // Initialize tracking scripts based on preferences
    initializeTracking(preferences);
  };

  const rejectAll = () => {
    const minimal = {
      necessary: true,
      analytics: false,
      marketing: false,
      personalization: false
    };
    
    localStorage.setItem('cookieConsent', 'rejected');
    localStorage.setItem('cookiePreferences', JSON.stringify(minimal));
    setPreferences(minimal);
    setShowBanner(false);
    
    // Only initialize necessary tracking
    initializeTracking(minimal);
  };

  const initializeTracking = (prefs: CookiePreferences) => {
    // Google Analytics
    if (prefs.analytics) {
      // Initialize GA4
      window.gtag?.('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
    
    // Marketing pixels
    if (prefs.marketing) {
      // Initialize Facebook Pixel, Google Ads, etc.
      window.gtag?.('consent', 'update', {
        ad_storage: 'granted',
        ad_user_data: 'granted',
        ad_personalization: 'granted'
      });
    }
    
    // Personalization
    if (prefs.personalization) {
      // Initialize personalization features
      window.gtag?.('consent', 'update', {
        personalization_storage: 'granted'
      });
    }
  };

  const handleToggle = (type: keyof CookiePreferences) => {
    if (type === 'necessary') return; // Can't disable necessary cookies
    
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
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
                    <Button
                      onClick={acceptAll}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold"
                    >
                      <Check className="w-4 h-4 mr-2" />
                      Accept All
                    </Button>
                    
                    <Button
                      onClick={() => setShowSettings(true)}
                      variant="outline"
                      className="border-yellow-600/30 text-yellow-400 hover:bg-yellow-500/10"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Customize
                    </Button>
                    
                    <Button
                      onClick={rejectAll}
                      variant="ghost"
                      className="text-gray-400 hover:text-white hover:bg-neutral-800"
                    >
                      Reject All
                    </Button>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowBanner(false)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            // Settings Panel
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Cookie Preferences</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4 mb-6">
                {/* Necessary Cookies */}
                <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-white">Necessary Cookies</h4>
                    <p className="text-sm text-gray-400">Essential for website functionality</p>
                  </div>
                  <div className="w-12 h-6 bg-green-600 rounded-full flex items-center justify-end px-1">
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
                
                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-white">Analytics Cookies</h4>
                    <p className="text-sm text-gray-400">Help us improve our website</p>
                  </div>
                  <button
                    onClick={() => handleToggle('analytics')}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      preferences.analytics ? 'bg-green-600 justify-end' : 'bg-gray-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
                
                {/* Marketing Cookies */}
                <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-white">Marketing Cookies</h4>
                    <p className="text-sm text-gray-400">Personalized advertisements</p>
                  </div>
                  <button
                    onClick={() => handleToggle('marketing')}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      preferences.marketing ? 'bg-green-600 justify-end' : 'bg-gray-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
                
                {/* Personalization Cookies */}
                <div className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-white">Personalization Cookies</h4>
                    <p className="text-sm text-gray-400">Customized content and features</p>
                  </div>
                  <button
                    onClick={() => handleToggle('personalization')}
                    className={`w-12 h-6 rounded-full flex items-center px-1 transition-colors ${
                      preferences.personalization ? 'bg-green-600 justify-end' : 'bg-gray-600 justify-start'
                    }`}
                  >
                    <div className="w-4 h-4 bg-white rounded-full"></div>
                  </button>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={acceptSelected}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold"
                >
                  Save Preferences
                </Button>
                
                <Button
                  onClick={acceptAll}
                  variant="outline"
                  className="border-yellow-600/30 text-yellow-400 hover:bg-yellow-500/10"
                >
                  Accept All
                </Button>
              </div>
              
              <p className="text-xs text-gray-400 mt-4">
                Learn more about our use of cookies in our{' '}
                <Link href="/cookies" className="text-yellow-400 hover:text-yellow-300 underline">
                  Cookie Policy
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-yellow-400 hover:text-yellow-300 underline">
                  Privacy Policy
                </Link>.
              </p>
            </div>
          )}
        </Card>
      </div>
    </>
  );
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
