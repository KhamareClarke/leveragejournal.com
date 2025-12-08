'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Target, TrendingUp, Zap, Star, ArrowRight, CheckCircle, User, LogOut, Clock, Trophy, Smartphone, Calendar, Shield, Truck, MessageCircle, X, Menu, LayoutDashboard } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ProductMockup from '@/components/ProductMockup';

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if popup was already dismissed - initialize state from localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem('exit-intent-dismissed');
    if (dismissed === 'true') {
      setShowExitIntent(false);
    }
  }, []);

  // Exit intent detection
  useEffect(() => {
    // Check if already dismissed before setting up listener
    const dismissed = localStorage.getItem('exit-intent-dismissed');
    if (dismissed === 'true') {
      setShowExitIntent(false);
      return; // Don't set up listener if already dismissed
    }
    
    const handleMouseLeave = (e: MouseEvent) => {
      // Double-check dismissal status before showing
      const isDismissed = localStorage.getItem('exit-intent-dismissed');
      if (isDismissed === 'true') {
        setShowExitIntent(false);
        return;
      }
      
      if (e.clientY <= 0 && !user) {
        setShowExitIntent(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [user]);

  // Scroll tracking for animations
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* ✅ Top Red Strip (Urgency Bar) - Compact */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white shadow-lg backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-1.5 md:py-2">
          <div className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 lg:gap-4 text-[10px] sm:text-xs font-medium">
            {/* Compact badge-style spacing */}
            <div className="flex items-center space-x-1 bg-white/10 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 backdrop-blur-sm">
              <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-white rounded-full animate-pulse"></div>
              <span className="font-bold whitespace-nowrap">🔥 LIMITED TIME</span>
            </div>
            
            <div className="flex items-center space-x-1 bg-white/10 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 backdrop-blur-sm">
              <span className="font-semibold whitespace-nowrap">50% OFF - £19.99</span>
              <span className="line-through text-red-200 text-[9px] sm:text-xs">£39.99</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-1 bg-white/10 rounded-full px-3 py-1 backdrop-blur-sm">
              <Clock className="w-3 h-3" />
              <span className="font-medium">Same Day Shipping</span>
            </div>
            
            <div className="hidden lg:flex items-center space-x-1 bg-white/10 rounded-full px-3 py-1 backdrop-blur-sm">
              <Shield className="w-3 h-3" />
              <span className="font-medium">30-Day Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Navigation Header - Mobile Responsive */}
      <nav className="fixed top-[36px] md:top-[40px] left-0 right-0 z-[55] bg-black/95 backdrop-blur-xl border-b border-yellow-600/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-5">
            {/* Premium Logo - Mobile Optimized */}
            <div className="flex items-center space-x-2 md:space-x-4 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-black" />
                </div>
              </div>
              <div className="hidden sm:block">
                <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 bg-clip-text text-transparent tracking-tight">
                  Leverage Journal™
                </span>
                <div className="text-[10px] md:text-xs text-gray-400 tracking-[0.2em] font-medium uppercase">90-Day Transformation</div>
              </div>
              <div className="sm:hidden">
                <span className="text-base font-bold bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                  Leverage™
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-10">
              <a href="#how-it-works" className="relative text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium group text-sm xl:text-base">
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#features" className="relative text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium group text-sm xl:text-base">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#testimonials" className="relative text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium group text-sm xl:text-base">
                Reviews
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              {!loading && user && (
                <Link href="/dashboard" className="relative text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium group text-sm xl:text-base">
                  <span className="flex items-center space-x-1 xl:space-x-2">
                    <LayoutDashboard className="w-4 h-4 xl:w-5 xl:h-5" />
                    <span>Dashboard</span>
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
              )}
              <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-full px-3 xl:px-4 py-1.5 xl:py-2 backdrop-blur-sm hover:border-yellow-400/50 transition-all duration-300">
                <span className="text-yellow-400 font-bold text-xs xl:text-sm">£19.99</span>
                <span className="text-gray-400 text-xs xl:text-sm ml-1 xl:ml-2 line-through">£39.99</span>
              </div>
            </div>

            {/* Desktop CTA Section */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
              {!loading && user ? (
                <Button variant="ghost" size="sm" onClick={signOut} className="text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 rounded-xl text-xs xl:text-sm">
                  <LogOut className="w-3 h-3 xl:w-4 xl:h-4 mr-1 xl:mr-2" />
                  <span className="hidden xl:inline">Sign Out</span>
                </Button>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button variant="ghost" className="text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all duration-300 rounded-xl font-medium text-xs xl:text-sm px-3 xl:px-4">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold px-3 xl:px-5 py-2 xl:py-2.5 transition-all duration-300 hover:scale-105 rounded-xl shadow-lg hover:shadow-yellow-500/30 text-xs xl:text-sm">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
              <Button className="relative bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold shadow-2xl shadow-yellow-600/40 transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/60 group overflow-hidden rounded-xl px-4 xl:px-6 py-2 xl:py-2.5 text-xs xl:text-sm">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center space-x-1 xl:space-x-2">
                  <span className="font-semibold hidden xl:inline">Pre-Order Now</span>
                  <span className="font-semibold xl:hidden">Order</span>
                  <ArrowRight className="w-3 h-3 xl:w-4 xl:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-yellow-400 transition-colors rounded-lg hover:bg-yellow-500/10"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${mobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="py-4 space-y-4 border-t border-yellow-600/20 mt-3">
              <a 
                href="#how-it-works" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium py-3 text-base touch-manipulation min-h-[44px] flex items-center"
              >
                How It Works
              </a>
              <a 
                href="#features" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium py-3 text-base touch-manipulation min-h-[44px] flex items-center"
              >
                Features
              </a>
              <a 
                href="#testimonials" 
                onClick={() => setMobileMenuOpen(false)}
                className="block text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium py-3 text-base touch-manipulation min-h-[44px] flex items-center"
              >
                Reviews
              </a>
              {!loading && user && (
                <Link 
                  href="/dashboard" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium py-3 text-base touch-manipulation min-h-[44px] flex items-center space-x-2"
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
              )}
              
              {/* Sign In / Sign Up Buttons - Mobile Optimized */}
              <div className="flex flex-col space-y-3 pt-2">
                {!loading && user ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={signOut} 
                    className="text-gray-300 hover:text-red-400 hover:bg-red-500/10 active:bg-red-500/20 transition-all duration-300 rounded-xl w-full py-4 text-base font-semibold touch-manipulation min-h-[56px] border border-gray-700/50 hover:border-red-500/30"
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Link href="/auth/signin" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Button 
                        variant="ghost" 
                        className="text-white hover:text-yellow-400 hover:bg-yellow-500/10 active:bg-yellow-500/20 transition-all duration-300 rounded-xl font-semibold w-full py-4 text-base touch-manipulation min-h-[56px] border border-yellow-600/30 hover:border-yellow-500/50 shadow-lg hover:shadow-yellow-500/20"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                      <Button 
                        className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 active:from-yellow-600 active:to-yellow-700 text-black font-bold w-full py-4 transition-all duration-300 active:scale-[0.98] rounded-xl shadow-2xl hover:shadow-yellow-500/40 text-base touch-manipulation min-h-[56px] border-2 border-yellow-400/50"
                      >
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 🟡 Hero Section - Fully Mobile Responsive */}
      <section className="relative min-h-screen flex items-center justify-center pt-8 sm:pt-12 md:pt-32 pb-12 md:pb-16">
        {/* Clean, Subtle Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-600/5 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 grid lg:grid-cols-2 gap-4 md:gap-12 items-center relative z-10">
          {/* Ultra Compact Content Spacing - Mobile Optimized */}
          <div className="text-center lg:text-left space-y-1 md:space-y-4">
            {/* Trust Badge - Mobile Optimized */}
            <div className="flex justify-center lg:justify-start mb-0.5 md:mb-0">
              <div className="inline-flex items-center space-x-1.5 md:space-x-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-3 md:px-5 py-1.5 md:py-2 backdrop-blur-sm">
                <div className="flex items-center space-x-0.5 md:space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-yellow-200 text-xs md:text-sm font-medium">Trusted by 10,000+ achievers</span>
              </div>
            </div>

            {/* Emotional Hook - Mobile Optimized */}
            <div className="space-y-1 md:space-y-3">
              <p className="text-sm md:text-base text-red-300 font-medium leading-relaxed">
                Tired of setting goals that never stick? 😔
              </p>
              
              {/* Main Headline - Mobile Optimized */}
              <div className="space-y-0.5 md:space-y-2">
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
                  <span className="block bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                    LEVERAGE
                  </span>
                  <span className="block bg-gradient-to-r from-yellow-300 to-yellow-200 bg-clip-text text-transparent">
                    JOURNAL™
                  </span>
                </h1>
                
                <div className="space-y-0.5 md:space-y-2">
                  <p className="text-base md:text-lg lg:text-xl text-yellow-100 font-light">Transform Your Life in 90 Days</p>
                  <div className="w-20 md:w-24 h-0.5 md:h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mx-auto lg:mx-0"></div>
                </div>
              </div>
            </div>

            {/* Value Proposition - Mobile Optimized */}
            <div className="py-0.5 md:py-2">
              <p className="text-sm md:text-base lg:text-lg text-gray-100 max-w-2xl leading-relaxed mx-auto lg:mx-0 px-2 md:px-0">
                <span className="text-yellow-300 font-semibold">Stop making promises you don't keep.</span> This isn't another planner that collects dust. 
                It's the <span className="text-yellow-300 font-semibold">scientifically-backed system</span> that <span className="text-yellow-300 font-semibold">10,000+ people</span> used to transform their lives in 90 days.
              </p>
            </div>

            {/* CTA - Mobile Optimized with Large Touch Target */}
            <div className="space-y-2 md:space-y-3 pt-1 md:pt-2">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-4 md:py-5 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 w-full lg:w-auto rounded-xl touch-manipulation min-h-[56px] md:min-h-[64px]"
              >
                <span className="flex items-center justify-center flex-wrap gap-2">
                  <span className="whitespace-nowrap">START YOUR TRANSFORMATION</span>
                  <span className="whitespace-nowrap">- £19.99</span>
                  <ArrowRight className="ml-2 md:ml-4 w-5 h-5 md:w-6 md:h-6 flex-shrink-0" />
                </span>
              </Button>
              
              {/* Clean single line guarantee - Mobile Optimized */}
              <div className="text-center lg:text-left px-2 md:px-0">
                <p className="text-xs md:text-sm text-gray-400 font-medium leading-relaxed">
                  30-Day Money-Back Guarantee • Free Shipping • Premium App Included
                </p>
              </div>
            </div>

            {/* Stats - Mobile Optimized */}
            <div className="grid grid-cols-3 gap-2 md:gap-4 py-2 md:py-3">
              <div className="text-center space-y-0.5 md:space-y-1">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-400">94%</div>
                <div className="text-xs md:text-sm text-gray-400 font-medium">Success Rate</div>
              </div>
              <div className="text-center space-y-0.5 md:space-y-1">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-400">10K+</div>
                <div className="text-xs md:text-sm text-gray-400 font-medium">Lives Changed</div>
              </div>
              <div className="text-center space-y-0.5 md:space-y-1">
                <div className="text-xl md:text-2xl lg:text-3xl font-bold text-yellow-400">4.9★</div>
                <div className="text-xs md:text-sm text-gray-400 font-medium">User Rated</div>
              </div>
            </div>


            {/* Moved CTA content above */}
            <div className="hidden">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-base px-10 py-4 shadow-2xl hover:scale-105 transition-all duration-300 w-full lg:w-auto rounded-xl"
              >
                <span className="flex items-center justify-center">
                  START YOUR TRANSFORMATION - £19.99
                  <ArrowRight className="ml-4 w-5 h-5" />
                </span>
              </Button>
              
              {/* Clean single line guarantee */}
              <div className="text-center lg:text-left">
                <p className="text-sm text-gray-400 font-medium">
                  30-Day Money-Back Guarantee • Free Shipping • Premium App Included
                </p>
              </div>
            </div>
          </div>

          {/* Product Mockup - Hidden on Mobile, Visible on Desktop */}
          <div className="hidden lg:flex relative items-center justify-end order-2">
            <div className="transform scale-80 origin-center">
              <ProductMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Exit Intent Popup */}
      {showExitIntent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-neutral-900 to-black border border-yellow-600/30 rounded-3xl p-8 max-w-md w-full relative">
            <button
              onClick={() => {
                setShowExitIntent(false);
                // Set with timestamp to ensure it persists
                localStorage.setItem('exit-intent-dismissed', 'true');
                localStorage.setItem('exit-intent-dismissed-time', Date.now().toString());
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
              aria-label="Close popup"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="w-8 h-8 text-black" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Wait! Don't Miss Out</h3>
                <p className="text-gray-300">
                  Join 10,000+ people transforming their lives. Get your Leverage Journal for just £19.99 (50% off).
                </p>
              </div>
              
              <div className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold">
                  Claim My 50% Discount Now
                </Button>
                <p className="text-xs text-gray-400">
                  ⏰ This offer expires in 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ⚫ Plan • Do • Achieve (How It Works) - Mobile Responsive */}
      <section id="how-it-works" className="py-12 md:py-16 lg:py-20 bg-neutral-950 relative">
        {/* Subtle divider above */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3">
              How It <span className="text-yellow-400">Works</span>
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed px-2 md:px-0">
              Stop the cycle of broken promises to yourself. Our scientifically-backed methodology has helped over 10,000 people break through procrastination and achieve life-changing results in just 90 days.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            {[
              {
                icon: Target,
                number: '01',
                title: 'Plan',
                subtitle: 'Vision to Strategy',
                description: 'Transform vague dreams into crystal-clear action plans using proven psychological frameworks. Design goals that align with your deepest values and create unstoppable momentum.',
                features: ['90-Day Vision Mapping', 'Identity-Based Goals', 'Psychology Frameworks']
              },
              {
                icon: Zap,
                number: '02',
                title: 'Do',
                subtitle: 'Action to Habit',
                description: 'Never wonder "what should I do today?" again. Our structured daily system eliminates decision fatigue and builds unbreakable habits that compound into extraordinary results.',
                features: ['Daily Action Tracking', 'App Sync & Reminders', 'Habit Formation']
              },
              {
                icon: TrendingUp,
                number: '03',
                title: 'Achieve',
                subtitle: 'Progress to Results',
                description: 'Watch your transformation unfold with real-time progress tracking. Celebrate every milestone and continuously optimize your approach for accelerated growth and lasting success.',
                features: ['Progress Analytics', 'System Optimization', 'Milestone Celebrations']
              }
            ].map((step, index) => (
              <Card key={index} className="bg-black/50 border border-yellow-600/20 p-4 md:p-6 hover:border-yellow-400/40 hover:shadow-xl hover:shadow-yellow-500/10 hover:scale-105 active:scale-95 transition-all duration-300 group rounded-xl md:rounded-2xl touch-manipulation">
                <div className="space-y-3 md:space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-600/20 group-hover:text-yellow-600/40 transition-colors duration-300">
                      {step.number}
                    </div>
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg md:rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                      <step.icon className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 text-black" />
                    </div>
                  </div>
                  
                  <div className="space-y-1.5 md:space-y-2 text-center">
                    <div>
                      <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-0.5 md:mb-1">{step.title}</h3>
                      <p className="text-xs md:text-sm text-yellow-400 font-semibold">{step.subtitle}</p>
                    </div>
                    
                    <p className="text-gray-300 leading-relaxed text-xs md:text-sm">{step.description}</p>
                    
                    <div className="space-y-1.5 md:space-y-2 pt-2 md:pt-3 border-t border-gray-700/50">
                      {step.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center justify-center space-x-1.5 md:space-x-2">
                          <CheckCircle className="w-3 h-3 md:w-3.5 md:h-3.5 text-green-400 flex-shrink-0" />
                          <span className="text-[10px] md:text-xs text-gray-400 font-medium text-center">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Subtle divider below */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
      </section>

      {/* 🔶 Everything You Need - Mobile Responsive */}
      <section id="features" className="py-12 md:py-16 lg:py-20 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3">
              Everything You <span className="text-yellow-400">Need</span>
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed px-2 md:px-0">
              Why choose between digital convenience and the proven power of handwriting? Get both. Our complete ecosystem combines the tactile satisfaction of journaling with cutting-edge technology for unstoppable results.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              {
                icon: BookOpen,
                title: 'Premium Journal',
                description: 'Luxurious hardcover journal with 180 pages of scientifically-designed layouts that guide your transformation journey'
              },
              {
                icon: Smartphone,
                title: 'Mobile App',
                description: 'Never miss a beat with intelligent reminders, seamless sync, and powerful analytics that keep you accountable 24/7'
              },
              {
                icon: Calendar,
                title: '90-Day System',
                description: 'The exact 90-day blueprint used by high-performers to create lasting change and build momentum that lasts a lifetime'
              },
              {
                icon: Trophy,
                title: 'Achievement Tracking',
                description: 'Turn small wins into unstoppable momentum with visual progress tracking and milestone celebrations that fuel your success'
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-neutral-900/50 border border-yellow-600/20 p-4 md:p-6 text-center hover:border-yellow-400/40 hover:shadow-xl hover:shadow-yellow-500/10 hover:scale-105 active:scale-95 transition-all duration-300 group rounded-lg md:rounded-xl touch-manipulation">
                <div className="space-y-3 md:space-y-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg md:rounded-xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-black" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm md:text-base lg:text-lg font-bold text-white leading-tight">{feature.title}</h3>
                    <p className="text-gray-400 text-[11px] md:text-xs leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 🟩 Testimonials (What People Are Saying) - Mobile Responsive */}
      <section id="testimonials" className="py-12 md:py-16 lg:py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 md:mb-3">
              What People Are <span className="text-yellow-400">Saying</span>
            </h2>
            <p className="text-sm md:text-base lg:text-lg text-gray-300 leading-relaxed px-2 md:px-0">Don't just take our word for it. Here's what happens when you commit to 90 days of transformation</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              {
                quote: "I was stuck in analysis paralysis for years. This system gave me the clarity and structure I needed to finally take action. The 90-day framework completely transformed how I approach my biggest goals.",
                author: "Sarah M.",
                role: "Entrepreneur",
                result: "Launched 2 businesses"
              },
              {
                quote: "I used to start strong but always fizzled out after a few weeks. The daily tracking and app reminders kept me consistent for the first time ever. My productivity literally doubled in 30 days.",
                author: "James P.",
                role: "Creative Director",
                result: "2x productivity increase"
              },
              {
                quote: "After trying every productivity system out there, I was skeptical. But something about the psychology-backed approach just clicked. I finally follow through on my commitments and hit 94% of my goals.",
                author: "Maya T.",
                role: "Founder",
                result: "94% goal completion rate"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-black/50 border border-yellow-600/20 p-5 md:p-8 lg:p-10 hover:border-yellow-400/40 hover:shadow-xl hover:shadow-yellow-500/10 transition-all duration-300 group rounded-2xl md:rounded-3xl relative overflow-hidden h-full">
                {/* Subtle quote mark background */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 text-4xl md:text-5xl lg:text-6xl text-yellow-500/10 font-serif leading-none">"</div>
                
                <div className="space-y-4 md:space-y-6 lg:space-y-8 relative z-10 h-full flex flex-col">
                  <div className="flex items-center space-x-0.5 md:space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  
                  <blockquote className="text-gray-100 text-sm md:text-base lg:text-lg leading-relaxed flex-grow">
                    "{testimonial.quote}"
                  </blockquote>
                  
                  <div className="space-y-3 md:space-y-4 pt-3 md:pt-4 border-t border-gray-700/50">
                    <div>
                      <div className="font-semibold text-white text-base md:text-lg">{testimonial.author}</div>
                      <div className="text-gray-400 text-xs md:text-sm">{testimonial.role}</div>
                    </div>
                    <div className="inline-flex items-center bg-green-500/10 border border-green-500/30 rounded-full px-3 md:px-4 py-1.5 md:py-2">
                      <span className="text-green-400 text-xs md:text-sm font-medium">{testimonial.result}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 🟨 Final CTA Section - Mobile Responsive */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-yellow-600/15 via-yellow-500/8 to-black relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 text-center space-y-6 md:space-y-8">
          <div className="space-y-2 md:space-y-3">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight px-2 md:px-0">
              Ready to <span className="text-yellow-400">Transform</span> Your Life?
            </h2>
            
            <p className="text-sm md:text-base lg:text-lg text-gray-200 max-w-4xl mx-auto leading-relaxed px-2 md:px-0">
              Stop letting another year slip by with the same unfulfilled goals. Join 10,000+ high-achievers who've broken the cycle of procrastination and created the life they actually want.
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-sm sm:text-base md:text-lg px-6 sm:px-8 md:px-12 py-4 md:py-6 shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 rounded-xl w-full sm:w-auto touch-manipulation min-h-[56px] md:min-h-[64px]"
            >
              <span className="flex items-center justify-center flex-wrap gap-2">
                <span className="whitespace-nowrap">GET YOUR LEVERAGE JOURNAL</span>
                <span className="whitespace-nowrap">- £19.99</span>
                <ArrowRight className="ml-2 md:ml-4 w-5 h-5 md:w-6 md:h-6 lg:w-8 lg:h-8 flex-shrink-0" />
              </span>
            </Button>

            <div className="space-y-3 md:space-y-4">
              <div className="text-yellow-200 font-bold text-sm md:text-base lg:text-lg">
                ⏰ Limited Time: 50% OFF (Usually £39.99)
              </div>

              {/* Compact icon badges - Mobile Responsive */}
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 md:gap-4 lg:gap-6 text-gray-300">
                <div className="flex items-center justify-center space-x-2 md:space-x-3 bg-black/20 rounded-full px-4 md:px-6 py-2.5 md:py-3 backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                  <span className="font-medium text-xs md:text-sm">30-Day Money Back Guarantee</span>
                </div>
                <div className="flex items-center justify-center space-x-2 md:space-x-3 bg-black/20 rounded-full px-4 md:px-6 py-2.5 md:py-3 backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                  <span className="font-medium text-xs md:text-sm">Free Worldwide Shipping</span>
                </div>
                <div className="flex items-center justify-center space-x-2 md:space-x-3 bg-black/20 rounded-full px-4 md:px-6 py-2.5 md:py-3 backdrop-blur-sm">
                  <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-green-400 flex-shrink-0" />
                  <span className="font-medium text-xs md:text-sm">Mobile App Included</span>
                </div>
              </div>

              {/* Clean shipping info - Mobile Responsive */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl md:rounded-3xl p-5 md:p-6 lg:p-8 max-w-2xl mx-auto backdrop-blur-sm">
                <div className="flex items-center justify-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                  <Clock className="w-5 h-5 md:w-6 md:h-6 text-yellow-400 flex-shrink-0" />
                  <span className="text-yellow-200 font-semibold text-base md:text-lg">Ships in 2-3 weeks</span>
                </div>
                <p className="text-gray-300 text-sm md:text-base">
                  Pre-order now to secure your copy. Limited first edition run.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⚫ Footer - Mobile Responsive */}
      <footer className="bg-black border-t border-yellow-600/30 py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 lg:gap-16 mb-8 md:mb-12 lg:mb-16">
            <div className="space-y-4 md:space-y-6 lg:space-y-8">
              <div className="flex items-center space-x-2 md:space-x-3">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-black" />
                </div>
                <span className="text-lg md:text-xl font-bold text-yellow-400">Leverage Journal™</span>
              </div>
              <p className="text-gray-400 leading-relaxed text-sm md:text-base">
                Transform your ambitions into achievements with our proven 90-day system.
              </p>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="text-gray-400 text-xs md:text-sm ml-1 md:ml-2">4.9/5 from 10,000+ users</span>
              </div>
              
              {/* Login Button for Return Users - Mobile Optimized */}
              <Link href="/dashboard" className="inline-block">
                <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold px-4 md:px-6 py-2.5 md:py-3 rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto touch-manipulation min-h-[44px] text-sm md:text-base">
                  <User className="w-4 h-4 mr-2" />
                  📘 Login to Dashboard
                </Button>
              </Link>
            </div>

            <div className="space-y-3 md:space-y-4">
              <h4 className="font-bold text-white mb-4 md:mb-6 lg:mb-8 text-base md:text-lg">Product</h4>
              <div className="space-y-3 md:space-y-4 text-gray-400">
                <div><a href="/features" className="hover:text-yellow-400 transition-colors font-medium text-sm md:text-base block py-1 touch-manipulation min-h-[44px] flex items-center">Features</a></div>
                <div><a href="/how-it-works" className="hover:text-yellow-400 transition-colors font-medium text-sm md:text-base block py-1 touch-manipulation min-h-[44px] flex items-center">How It Works</a></div>
                <div><a href="/faq" className="hover:text-yellow-400 transition-colors font-medium text-sm md:text-base block py-1 touch-manipulation min-h-[44px] flex items-center">FAQ</a></div>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <h4 className="font-bold text-white mb-4 md:mb-6 lg:mb-8 text-base md:text-lg">Support</h4>
              <div className="space-y-3 md:space-y-4 text-gray-400">
                <div><a href="/contact" className="hover:text-yellow-400 transition-colors font-medium text-sm md:text-base block py-1 touch-manipulation min-h-[44px] flex items-center">Contact</a></div>
                <div><a href="/support" className="hover:text-yellow-400 transition-colors font-medium text-sm md:text-base block py-1 touch-manipulation min-h-[44px] flex items-center">Help Center</a></div>
                <div><a href="/shipping" className="hover:text-yellow-400 transition-colors font-medium text-sm md:text-base block py-1 touch-manipulation min-h-[44px] flex items-center">Shipping</a></div>
                <div><a href="/returns" className="hover:text-yellow-400 transition-colors font-medium text-sm md:text-base block py-1 touch-manipulation min-h-[44px] flex items-center">Returns</a></div>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <h4 className="font-bold text-white mb-4 md:mb-6 lg:mb-8 text-base md:text-lg">Legal</h4>
              <div className="space-y-3 md:space-y-4 text-gray-400">
                <div><a href="/privacy" className="hover:text-yellow-400 transition-colors font-medium text-sm md:text-base block py-1 touch-manipulation min-h-[44px] flex items-center">Privacy Policy</a></div>
                <div><a href="/terms" className="hover:text-yellow-400 transition-colors font-medium text-sm md:text-base block py-1 touch-manipulation min-h-[44px] flex items-center">Terms of Service</a></div>
                <div><a href="/returns" className="hover:text-yellow-400 transition-colors font-medium text-sm md:text-base block py-1 touch-manipulation min-h-[44px] flex items-center">Return Policy</a></div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 md:pt-8 lg:pt-12 text-center">
            <p className="text-gray-400 text-xs md:text-sm lg:text-base px-2">
              &copy; 2024 Leverage Journal™. All rights reserved. Transform your ambitions into achievements.
            </p>
          </div>
        </div>
      </footer>

      {/* Live Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {showChatWidget ? (
          <div className="bg-gradient-to-br from-neutral-900 to-black border border-yellow-600/30 rounded-2xl p-4 w-80 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-black" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Live Support</h4>
                  <p className="text-green-400 text-xs">Online now</p>
                </div>
              </div>
              <button onClick={() => setShowChatWidget(false)} className="text-gray-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-200 text-sm">
                  Hi! 👋 Questions about the Leverage Journal? I'm here to help!
                </p>
              </div>
              <input
                type="text"
                placeholder="Type your message..."
                className="w-full bg-neutral-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-yellow-500"
              />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowChatWidget(true)}
            className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 group"
          >
            <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
