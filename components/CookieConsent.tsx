'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Cookie, X, Settings, Shield, BarChart, Target } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a short delay
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(consent);
        setPreferences(savedPreferences);
      } catch (error) {
        console.error('Error parsing cookie preferences:', error);
      }
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookie-consent', JSON.stringify(allAccepted));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
    
    // Initialize analytics and marketing scripts here
    initializeScripts(allAccepted);
  };

  const acceptNecessary = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false,
    };
    setPreferences(necessaryOnly);
    localStorage.setItem('cookie-consent', JSON.stringify(necessaryOnly));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = () => {
    localStorage.setItem('cookie-consent', JSON.stringify(preferences));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
    
    // Initialize scripts based on preferences
    initializeScripts(preferences);
  };

  const initializeScripts = (prefs: typeof preferences) => {
    // Initialize Google Analytics if analytics is enabled
    if (prefs.analytics && typeof window !== 'undefined') {
      // Add Google Analytics script
      const script = document.createElement('script');
      script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
      script.async = true;
      document.head.appendChild(script);

      // Initialize gtag
      window.gtag = window.gtag || function(...args: any[]) {
        ((window.gtag as any).q = (window.gtag as any).q || []).push(args);
      };
      window.gtag('js', new Date());
      window.gtag('config', 'GA_MEASUREMENT_ID');
    }

    // Initialize marketing pixels if marketing is enabled
    if (prefs.marketing && typeof window !== 'undefined') {
      // Add Facebook Pixel, Google Ads, etc.
      // Example Facebook Pixel initialization
      // fbq('init', 'YOUR_PIXEL_ID');
      // fbq('track', 'PageView');
    }
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-[100]">
        <Card className="bg-black/95 border-t border-yellow-600/30 backdrop-blur-xl shadow-2xl rounded-none w-full">
          <div className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-black" />
              </div>
              
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-white mb-2">We Value Your Privacy</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. 
                    By clicking "Accept All", you consent to our use of cookies. You can customize your preferences or learn more in our{' '}
                    <a href="/privacy" className="text-yellow-400 hover:text-yellow-300 underline">Privacy Policy</a>.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={acceptAll}
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold px-6 py-2 rounded-xl"
                  >
                    Accept All Cookies
                  </Button>
                  
                  <Button
                    onClick={acceptNecessary}
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-800 px-6 py-2 rounded-xl"
                  >
                    Necessary Only
                  </Button>
                  
                  <Button
                    onClick={() => setShowSettings(true)}
                    variant="ghost"
                    className="text-gray-400 hover:text-white px-6 py-2 rounded-xl"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                </div>
              </div>
              
              <button
                onClick={() => setShowBanner(false)}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Card>
      </div>

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="bg-black/95 border border-yellow-600/30 backdrop-blur-xl shadow-2xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Cookie Preferences</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-gray-300 text-sm">
                  Manage your cookie preferences below. You can enable or disable different types of cookies based on your preferences.
                </p>

                {/* Necessary Cookies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-green-400" />
                      <div>
                        <h3 className="font-semibold text-white">Necessary Cookies</h3>
                        <p className="text-xs text-gray-400">Required for basic site functionality</p>
                      </div>
                    </div>
                    <div className="bg-green-600 rounded-full px-3 py-1 text-xs text-white font-medium">
                      Always Active
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 ml-8">
                    These cookies are essential for the website to function properly. They enable core functionality such as security, network management, and accessibility.
                  </p>
                </div>

                {/* Analytics Cookies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BarChart className="w-5 h-5 text-blue-400" />
                      <div>
                        <h3 className="font-semibold text-white">Analytics Cookies</h3>
                        <p className="text-xs text-gray-400">Help us understand how you use our site</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-400 ml-8">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                </div>

                {/* Marketing Cookies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-purple-400" />
                      <div>
                        <h3 className="font-semibold text-white">Marketing Cookies</h3>
                        <p className="text-xs text-gray-400">Used to deliver relevant advertisements</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-400 ml-8">
                    These cookies are used to make advertising messages more relevant to you and your interests.
                  </p>
                </div>

                {/* Preference Cookies */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-orange-400" />
                      <div>
                        <h3 className="font-semibold text-white">Preference Cookies</h3>
                        <p className="text-xs text-gray-400">Remember your settings and preferences</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={preferences.preferences}
                        onChange={(e) => setPreferences(prev => ({ ...prev, preferences: e.target.checked }))}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                    </label>
                  </div>
                  <p className="text-sm text-gray-400 ml-8">
                    These cookies enable the website to remember choices you make and provide enhanced, more personal features.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-gray-700">
                <Button
                  onClick={savePreferences}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold px-6 py-2 rounded-xl flex-1"
                >
                  Save Preferences
                </Button>
                
                <Button
                  onClick={acceptAll}
                  variant="outline"
                  className="border-yellow-600 text-yellow-400 hover:bg-yellow-600/10 px-6 py-2 rounded-xl flex-1"
                >
                  Accept All
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
