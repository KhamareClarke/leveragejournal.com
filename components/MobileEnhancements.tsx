'use client';

import { useEffect, useState, useRef } from 'react';

interface MobileEnhancementsProps {
  currentDay: number;
  setCurrentDay: (day: number) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function MobileEnhancements({ 
  currentDay, 
  setCurrentDay, 
  activeTab, 
  setActiveTab 
}: MobileEnhancementsProps) {
  const [isStandalone, setIsStandalone] = useState(false);
  const [orientation, setOrientation] = useState('portrait');

  useEffect(() => {
    // Check if running as PWA
    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);
    
    // Handle orientation changes
    const handleOrientationChange = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    window.addEventListener('resize', handleOrientationChange);
    handleOrientationChange();

    return () => window.removeEventListener('resize', handleOrientationChange);
  }, []);

  // Custom touch handlers for swipe gestures
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    const swipeDistance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (Math.abs(swipeDistance) < minSwipeDistance) return;

    if (activeTab === 'do') {
      // Journal navigation
      if (swipeDistance > 0 && currentDay < 90) {
        setCurrentDay(currentDay + 1);
        triggerHaptic('light');
      } else if (swipeDistance < 0 && currentDay > 1) {
        setCurrentDay(currentDay - 1);
        triggerHaptic('light');
      }
    } else {
      // Tab navigation
      const tabs = ['home', 'foundation', 'plan', 'do', 'achieve', 'stats', 'settings'];
      const currentIndex = tabs.indexOf(activeTab);
      
      if (swipeDistance > 0 && currentIndex < tabs.length - 1) {
        setActiveTab(tabs[currentIndex + 1]);
        triggerHaptic('medium');
      } else if (swipeDistance < 0 && currentIndex > 0) {
        setActiveTab(tabs[currentIndex - 1]);
        triggerHaptic('medium');
      }
    }
  };

  // Haptic feedback for mobile interactions
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
  };

  // Add touch feedback to buttons
  useEffect(() => {
    const addTouchFeedback = (event: TouchEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.closest('button')) {
        triggerHaptic('light');
      }
    };

    document.addEventListener('touchstart', addTouchFeedback);
    return () => document.removeEventListener('touchstart', addTouchFeedback);
  }, []);

  // Prevent zoom on double tap
  useEffect(() => {
    let lastTouchEnd = 0;
    const preventZoom = (event: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchend', preventZoom, { passive: false });
    return () => document.removeEventListener('touchend', preventZoom);
  }, []);

  // Add touch event listeners
  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeTab, currentDay]);

  return (
    <div className="touch-manipulation">
      {/* Status bar spacer for PWA */}
      {isStandalone && (
        <div className="h-safe-area-inset-top bg-black"></div>
      )}
      
      {/* Orientation indicator for development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-2 right-2 z-50 bg-yellow-500 text-black px-2 py-1 rounded text-xs">
          {orientation} | {isStandalone ? 'PWA' : 'Browser'}
        </div>
      )}
      
      {/* Pull-to-refresh indicator */}
      <div id="pull-to-refresh" className="hidden">
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-yellow-400"></div>
        </div>
      </div>
    </div>
  );
}
