'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Star, ArrowRight, CheckCircle, Target, Zap, TrendingUp, Shield, Truck, Heart, ShoppingBag, ShoppingCart, Menu, X, MessageCircle, LogOut, LayoutDashboard, Calendar, Trophy, Smartphone, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import ProductMockup from '@/components/ProductMockup';
import { createCheckoutSession } from '@/lib/stripe';

export default function Home() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const { addToCart, getTotalItems } = useCart();
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [processingButtonId, setProcessingButtonId] = useState<string | null>(null);

  // Handle checkout with button ID to track which button is processing
  const handleCheckout = async (buttonId?: string) => {
    try {
      if (buttonId) {
        setProcessingButtonId(buttonId);
      }
      await createCheckoutSession(user?.id, user?.email);
      // Note: If redirect is successful, we won't reach here
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(error.message || 'Failed to start checkout. Please try again.');
      setProcessingButtonId(null);
    }
  };

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart({
      id: 'leverage-journal',
      name: 'Leverage Journal - First Edition A5',
      price: 1999, // £19.99 in pence
      quantity: 1,
      image: '/images/journal-product.png',
    });
    router.push('/cart');
  };

  // Structured Data for Reviews
  const reviewsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": [
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Sarah M." },
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "reviewBody": "I was stuck for years. This journal didn't just change my goals—it changed who I am. I finally became the person I knew I could be.",
        "datePublished": "2024-11-01"
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "James P." },
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "reviewBody": "For the first time in my life, I followed through. No more excuses. No more 'tomorrow.' Just real, measurable progress every single day.",
        "datePublished": "2024-10-28"
      },
      {
        "@type": "Review",
        "author": { "@type": "Person", "name": "Maya T." },
        "reviewRating": { "@type": "Rating", "ratingValue": "5", "bestRating": "5" },
        "reviewBody": "I used to set goals and forget them. Now I wake up with purpose. I know exactly who I'm becoming and how to get there.",
        "datePublished": "2024-10-25"
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://leveragejournal.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Shop",
        "item": "https://leveragejournal.com/#shop"
      }
    ]
  };

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
    <>
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewsSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <main className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Top Luxury Strip - Ultra Premium */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-black/95 backdrop-blur-xl border-b border-[#f1cb32]/20 shadow-[0_4px_24px_rgba(241,203,50,0.15)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 md:py-2.5">
          <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 lg:gap-6 text-[10px] sm:text-xs font-medium">
            {/* Luxury badge-style spacing */}
            <div className="flex items-center space-x-1.5 bg-[#f1cb32]/10 border border-[#f1cb32]/30 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 backdrop-blur-sm shadow-[0_2px_8px_rgba(241,203,50,0.1)]">
              <span className="font-bold whitespace-nowrap text-[#f1cb32]">LIMITED AVAILABILITY</span>
            </div>
            
            <div className="flex items-center space-x-2 bg-[#f1cb32]/10 border border-[#f1cb32]/30 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 backdrop-blur-sm shadow-[0_2px_8px_rgba(241,203,50,0.1)]">
              <span className="font-semibold whitespace-nowrap text-white">£19.99</span>
              <span className="line-through text-gray-400 text-[9px] sm:text-xs">£39.99</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-1.5 bg-[#f1cb32]/10 border border-[#f1cb32]/30 rounded-full px-4 py-1.5 backdrop-blur-sm shadow-[0_2px_8px_rgba(241,203,50,0.1)]">
              <Shield className="w-3 h-3 text-blue-400" />
              <span className="font-medium text-white">30-Day Guarantee</span>
            </div>
            
            <div className="hidden lg:flex items-center space-x-1.5 bg-[#f1cb32]/10 border border-[#f1cb32]/30 rounded-full px-4 py-1.5 backdrop-blur-sm shadow-[0_2px_8px_rgba(241,203,50,0.1)]">
              <Truck className="w-3 h-3 text-green-400" />
              <span className="font-medium text-white">Free Shipping</span>
            </div>
          </div>
        </div>
      </div>

      {/* Ultra-Luxury Navigation Header */}
      <nav className="fixed top-[44px] md:top-[48px] left-0 right-0 z-[55] bg-black/98 backdrop-blur-2xl border-b border-[#f1cb32]/20 shadow-[0_8px_32px_rgba(241,203,50,0.12)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 md:py-5">
            {/* Premium Logo - Mobile Optimized */}
            <div className="flex items-center space-x-2 md:space-x-4 group">
              <div className="relative w-10 h-10 md:w-12 md:h-12">
                <Image
                  src="/images/logo.svg"
                  alt="Leverage Journal Logo"
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-300"
                  priority
                />
              </div>
              <div className="hidden sm:block">
                <span className="text-lg md:text-2xl font-bold tracking-tight">
                  <span className="text-white">Leverage </span>
                  <span className="animate-gradient">Journal™</span>
                </span>
                <div className="text-[10px] md:text-xs text-gray-400 tracking-wide font-medium">90-day blueprint for success</div>
              </div>
              <div className="sm:hidden">
                <span className="text-base font-bold animate-gradient">
                  Leverage™
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-10">
              <a href="#how-it-works" className="relative text-gray-300 hover:text-[#f1cb32] transition-all duration-300 font-medium group text-sm xl:text-base">
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f1cb32] group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#features" className="relative text-gray-300 hover:text-[#f1cb32] transition-all duration-300 font-medium group text-sm xl:text-base">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f1cb32] group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#testimonials" className="relative text-gray-300 hover:text-[#f1cb32] transition-all duration-300 font-medium group text-sm xl:text-base">
                Reviews
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f1cb32] group-hover:w-full transition-all duration-300"></span>
              </a>
              {!loading && user && (
                <Link href="/dashboard" className="relative text-gray-300 hover:text-[#f1cb32] transition-all duration-300 font-medium group text-sm xl:text-base">
                  <span className="flex items-center space-x-1 xl:space-x-2">
                    <LayoutDashboard className="w-4 h-4 xl:w-5 xl:h-5" />
                    <span>Dashboard</span>
                  </span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#f1cb32] group-hover:w-full transition-all duration-300"></span>
                </Link>
              )}
            </div>

            {/* Desktop CTA Section */}
            <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
              {!loading && user ? (
                <Button variant="ghost" size="sm" onClick={signOut} className="text-gray-300 hover:text-[#f1cb32] hover:bg-[#f1cb32]/10 transition-all duration-300 rounded-xl text-xs xl:text-sm border border-transparent hover:border-[#f1cb32]/30">
                  <LogOut className="w-3 h-3 xl:w-4 xl:h-4 mr-1 xl:mr-2" />
                  <span className="hidden xl:inline">Sign Out</span>
                </Button>
              ) : (
                <>
                  <Link href="/auth/signin">
                    <Button variant="ghost" className="text-gray-300 hover:text-[#f1cb32] hover:bg-[#f1cb32]/10 transition-all duration-300 rounded-xl font-medium text-xs xl:text-sm px-3 xl:px-4 border border-transparent hover:border-[#f1cb32]/30">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/signup">
                    <Button className="bg-black border-2 border-[#f1cb32] hover:bg-[#f1cb32]/10 font-bold px-3 xl:px-5 py-2 xl:py-2.5 transition-all duration-300 hover:scale-105 rounded-xl shadow-[0_4px_16px_rgba(241,203,50,0.3)] hover:shadow-[0_8px_24px_rgba(241,203,50,0.5)] text-xs xl:text-sm backdrop-blur-sm">
                      <span className="animate-gradient">Sign Up</span>
                    </Button>
                  </Link>
                </>
              )}
              <Button 
                onClick={() => handleCheckout('nav-order')}
                disabled={processingButtonId === 'nav-order'}
                className="relative bg-black border-2 border-[#f1cb32] hover:bg-[#f1cb32]/10 font-bold shadow-[0_4px_16px_rgba(241,203,50,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_24px_rgba(241,203,50,0.5)] group overflow-hidden rounded-xl px-4 xl:px-6 py-2 xl:py-2.5 text-xs xl:text-sm backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed">
                <div className="absolute inset-0 bg-gradient-to-r from-[#f1cb32]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center space-x-1 xl:space-x-2">
                  <span className="font-semibold hidden xl:inline animate-gradient">{processingButtonId === 'nav-order' ? 'Processing...' : 'Order Now'}</span>
                  <span className="font-semibold xl:hidden animate-gradient">{processingButtonId === 'nav-order' ? 'Processing...' : 'Order'}</span>
                  <ArrowRight className="w-3 h-3 xl:w-4 xl:h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
              
              <div className="w-px h-6 bg-gray-700"></div>
              
              {/* Wishlist Icon */}
              <button className="relative p-2 text-gray-300 hover:text-red-400 transition-all duration-300 rounded-lg hover:bg-red-500/10 group">
                <Heart className="w-5 h-5 xl:w-6 xl:h-6 text-red-400" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[#f1cb32] to-[#d4a017] text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(241,203,50,0.4)]">0</span>
              </button>
              
              {/* Basket Icon */}
              <button className="relative p-2 text-gray-300 hover:text-purple-400 transition-all duration-300 rounded-lg hover:bg-purple-500/10 group">
                <ShoppingBag className="w-5 h-5 xl:w-6 xl:h-6 text-purple-400" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-[#f1cb32] to-[#d4a017] text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(241,203,50,0.4)]">0</span>
              </button>
              
              {/* Cart Icon */}
              <Link href="/cart">
                <button className="relative p-2 text-gray-300 hover:text-yellow-400 transition-all duration-300 rounded-lg hover:bg-yellow-500/10 group">
                  <ShoppingCart className="w-5 h-5 xl:w-6 xl:h-6 text-yellow-400" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-[#f1cb32] to-[#d4a017] text-black text-[10px] font-bold rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(241,203,50,0.4)]">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
              </Link>
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
      <section className="relative min-h-screen flex items-center justify-center pt-32 sm:pt-36 md:pt-32 pb-20 md:pb-24 overflow-hidden">
        {/* Ultra-Luxury Background with Gold Spotlight */}
        <div className="absolute inset-0 bg-black"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black"></div>
        {/* Gold spotlight glow behind headline */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#f1cb32] opacity-[0.08] blur-[120px] rounded-full"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#f1cb32]/10 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>
        {/* Subtle gold shimmer overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(241,203,50,0.03)_0%,_transparent_50%)]"></div>
        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-[#f1cb32] rounded-full opacity-40 animate-float-slow"></div>
          <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-[#f1cb32] rounded-full opacity-30 animate-float-slower"></div>
          <div className="absolute bottom-1/3 left-1/3 w-1 h-1 bg-[#f1cb32] rounded-full opacity-50 animate-float-slow"></div>
          <div className="absolute top-2/3 right-1/3 w-1 h-1 bg-[#f1cb32] rounded-full opacity-35 animate-float-slower"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="text-center space-y-6">
            {/* Trust Badge */}
            <div className="flex justify-center pt-4">
              <div className="inline-flex items-center gap-3 bg-black/40 border border-[#f1cb32]/30 rounded-full px-6 py-2.5 backdrop-blur-xl shadow-[0_8px_32px_rgba(241,203,50,0.2)]">
                <span className="text-white text-sm font-bold"><span className="animate-gradient">10,000+</span> Users</span>
                <span className="text-gray-400">•</span>
                <span className="text-white text-sm font-bold"><span className="animate-gradient">4.9</span> ★ Average</span>
              </div>
            </div>

            {/* Headline */}
            <div className="space-y-2 animate-fade-in">
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight">
                <span className="block text-white drop-shadow-[0_8px_32px_rgba(255,255,255,0.3)] uppercase">
                  THE
                </span>
                <span className="block text-white drop-shadow-[0_8px_32px_rgba(255,255,255,0.3)] uppercase">
                  LEVERAGE
                </span>
                <span className="block animate-gradient drop-shadow-[0_8px_32px_rgba(241,203,50,0.6)] uppercase">
                  JOURNAL™
                </span>
              </h1>
            </div>

            {/* Subhead */}
            <div className="max-w-2xl mx-auto pt-3">
              <p className="text-xl md:text-2xl text-white font-semibold leading-relaxed">
                Plan • Do • Achieve
              </p>
            </div>

            {/* CTA Button */}
            <div className="animate-fade-in-delay-2 max-w-lg mx-auto pt-6">
              <Button
                onClick={() => handleCheckout('hero-cta')}
                disabled={processingButtonId === 'hero-cta'}
                size="lg"
                className="relative bg-black/80 backdrop-blur-xl border-2 border-[#f1cb32] hover:bg-[#f1cb32]/10 text-white font-bold px-12 py-6 rounded-2xl shadow-[0_16px_48px_rgba(241,203,50,0.3),0_0_32px_rgba(241,203,50,0.15)] hover:shadow-[0_20px_60px_rgba(241,203,50,0.45),0_0_48px_rgba(241,203,50,0.25)] transition-all duration-300 hover:scale-105 text-lg group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f1cb32]/20 to-transparent group-hover:animate-shimmer"></div>
                <span className="flex items-center gap-3 relative z-10">
                  <span className="font-bold text-white">{processingButtonId === 'hero-cta' ? 'Processing...' : 'Get The Journal'}</span>
                  <span className="text-xl font-black animate-gradient">£19.99</span>
                </span>
              </Button>
              <p className="text-center text-gray-400 text-xs mt-4">
                ✅ Free Shipping • 30-Day Money Back Guarantee
              </p>
            </div>

            {/* Offer Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 pt-8 px-4">
              <div className="flex items-center gap-2 text-sm bg-[#f1cb32]/10 border border-[#f1cb32]/30 rounded-full px-4 py-2">
                <Zap className="w-4 h-4 text-[#f1cb32]" />
                <span className="text-white font-semibold">50% OFF – Today Only</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2">
                <Truck className="w-4 h-4 text-green-400" />
                <span className="text-white font-semibold">Free UK Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-blue-500/10 border border-blue-500/30 rounded-full px-4 py-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                <span className="text-white font-semibold">First Edition A5</span>
              </div>
              <div className="flex items-center gap-2 text-sm bg-red-500/10 border border-red-500/30 rounded-full px-4 py-2">
                <span className="text-white font-semibold">⚡ Only 247 Copies Left</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Ultra-thin gold divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#f1cb32]/40 to-transparent"></div>
      
      {/* Stats Section - Full Width */}
      <section className="py-24 md:py-32 bg-black relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#f1cb32]/5 via-transparent to-transparent"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="bg-black/60 backdrop-blur-xl border border-[#f1cb32]/20 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 lg:p-16 shadow-[0_20px_80px_rgba(241,203,50,0.15),inset_0_1px_0_0_rgba(241,203,50,0.05)]">
            <div className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-12 lg:gap-20 divide-x divide-[#f1cb32]/20">
              <div className="text-center px-2 sm:px-4 md:px-6">
                <div className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-2 sm:mb-4 md:mb-6 drop-shadow-[0_8px_32px_rgba(241,203,50,0.4)]">
                  <span className="animate-gradient">94%</span>
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 font-medium uppercase tracking-wider">Success Rate</div>
              </div>
              <div className="text-center px-2 sm:px-4 md:px-6">
                <div className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-2 sm:mb-4 md:mb-6 drop-shadow-[0_8px_32px_rgba(241,203,50,0.4)]">
                  <span className="animate-gradient">10K+</span>
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 font-medium uppercase tracking-wider">Active Users</div>
              </div>
              <div className="text-center px-2 sm:px-4 md:px-6">
                <div className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight mb-2 sm:mb-4 md:mb-6 drop-shadow-[0_8px_32px_rgba(241,203,50,0.4)]">
                  <span className="animate-gradient">4.9</span>
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm text-gray-400 font-medium uppercase tracking-wider">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exit Intent Popup */}
      {showExitIntent && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-black/80 backdrop-blur-2xl border-2 border-[#f1cb32]/30 rounded-3xl p-10 max-w-md w-full relative shadow-[0_24px_80px_rgba(241,203,50,0.3),0_0_60px_rgba(241,203,50,0.2)] overflow-hidden">
            {/* Gold shimmer overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#f1cb32]/5 via-transparent to-transparent"></div>
            <button
              onClick={() => {
                setShowExitIntent(false);
                // Set with timestamp to ensure it persists
                localStorage.setItem('exit-intent-dismissed', 'true');
                localStorage.setItem('exit-intent-dismissed-time', Date.now().toString());
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-[#f1cb32] z-10 transition-colors p-2 hover:bg-[#f1cb32]/10 rounded-full border border-transparent hover:border-[#f1cb32]/30"
              aria-label="Close popup"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-gradient-to-br from-[#f1cb32] to-[#d4a017] rounded-full flex items-center justify-center mx-auto shadow-[0_8px_32px_rgba(241,203,50,0.5)] border border-[#f1cb32]/30">
                <Trophy className="w-8 h-8 text-black" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-[0_4px_16px_rgba(255,255,255,0.1)] relative z-10">Wait! Don't Miss Out</h3>
                <p className="text-gray-300 relative z-10">
                  Join <span className="text-[#f1cb32] font-semibold">10,000+</span> people transforming their lives. Get your Leverage Journal for just £19.99 (50% off).
                </p>
              </div>
              
              <div className="space-y-3">
                <Button 
                  onClick={async () => {
                    // Close popup when button is clicked
                    setShowExitIntent(false);
                    localStorage.setItem('exit-intent-dismissed', 'true');
                    localStorage.setItem('exit-intent-dismissed-time', Date.now().toString());
                    // Start checkout
                    await handleCheckout('exit-intent');
                  }}
                  disabled={processingButtonId === 'exit-intent'}
                  className="w-full bg-black/80 backdrop-blur-xl border-2 border-[#f1cb32] hover:bg-[#f1cb32]/10 text-[#f1cb32] font-bold py-4 rounded-xl shadow-[0_8px_32px_rgba(241,203,50,0.4)] hover:shadow-[0_12px_48px_rgba(241,203,50,0.6)] transition-all duration-300 hover:scale-105 relative group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10">{processingButtonId === 'exit-intent' ? 'Processing...' : 'Claim My 50% Discount Now'}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f1cb32]/20 to-transparent group-hover:animate-shimmer"></div>
                </Button>
                <button
                  onClick={() => {
                    setShowExitIntent(false);
                    localStorage.setItem('exit-intent-dismissed', 'true');
                    localStorage.setItem('exit-intent-dismissed-time', Date.now().toString());
                  }}
                  className="text-xs text-gray-400 hover:text-[#f1cb32] underline w-full relative z-10 transition-colors"
                >
                  No thanks, I'll pass
                </button>
                <p className="text-xs text-gray-400">
                  ⏰ This offer expires in 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ultra-thin gold divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#f1cb32]/40 to-transparent"></div>
      
      {/* Why This Journal Works Section */}
      <section className="py-20 md:py-32 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#f1cb32]/8 via-transparent to-transparent"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#f1cb32] opacity-5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#f1cb32] opacity-5 blur-[120px] rounded-full"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Content Details - Mobile First */}
            <div className="space-y-8 order-1 lg:order-2">
              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight">
                  <span className="block text-white drop-shadow-[0_4px_24px_rgba(255,255,255,0.15)]">WHY THIS</span>
                  <span className="block animate-gradient drop-shadow-[0_8px_32px_rgba(241,203,50,0.5)]">JOURNAL WORKS</span>
                </h2>
                <p className="text-white text-xl leading-relaxed font-medium">
                  Most people fail not from lack of ambition, but from lack of method.
                </p>
              </div>

              {/* Features List */}
              <div className="space-y-3">
                {[
                  { icon: Target, title: 'Strategic Architecture' },
                  { icon: Zap, title: 'Daily Discipline' },
                  { icon: TrendingUp, title: 'Weekly Mastery' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-gradient-to-br from-black/80 to-black/60 backdrop-blur-xl rounded-xl border border-[#f1cb32]/30 hover:border-[#f1cb32]/50 transition-all duration-300 shadow-[0_8px_32px_rgba(241,203,50,0.12)] hover:shadow-[0_16px_48px_rgba(241,203,50,0.25)] group/item">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#f1cb32]/30 to-[#f1cb32]/10 rounded-lg flex items-center justify-center flex-shrink-0 shadow-[0_4px_16px_rgba(241,203,50,0.3)] border border-[#f1cb32]/30 group-hover/item:scale-110 transition-all duration-300">
                      <item.icon className="w-5 h-5 text-[#f1cb32]" />
                    </div>
                    <h3 className="text-white font-bold text-lg">{item.title}</h3>
                  </div>
                ))}
              </div>

              {/* Social Proof */}
              <div className="flex items-center gap-6 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-black animate-gradient">10,000+</div>
                  <div className="text-xs text-gray-400">Happy Customers</div>
                </div>
                <div className="w-px h-12 bg-gray-700"></div>
                <div className="text-center">
                  <div className="text-3xl font-black animate-gradient">4.9/5</div>
                  <div className="text-xs text-gray-400">Rating</div>
                </div>
                <div className="w-px h-12 bg-gray-700"></div>
                <div className="text-center">
                  <div className="text-xs text-gray-400">Verified Reviews</div>
                </div>
              </div>

              {/* CTA Button - Desktop Only */}
              <div className="hidden lg:block">
                <Button 
                  onClick={() => handleCheckout('why-works-desktop')}
                  disabled={processingButtonId === 'why-works-desktop'}
                  className="w-full relative bg-gradient-to-r from-black/90 to-black/80 backdrop-blur-xl border-2 border-[#f1cb32] hover:border-[#f1cb32]/80 hover:bg-[#f1cb32]/5 text-white font-bold py-6 rounded-2xl shadow-[0_24px_80px_rgba(241,203,50,0.4),0_0_48px_rgba(241,203,50,0.2)] hover:shadow-[0_32px_100px_rgba(241,203,50,0.6),0_0_64px_rgba(241,203,50,0.3)] transition-all duration-500 hover:scale-[1.02] text-lg group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f1cb32]/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="flex items-center justify-center gap-4 relative z-10">
                    <span className="text-white font-black text-xl">{processingButtonId === 'why-works-desktop' ? 'Processing...' : 'Get Started'}</span>
                    <span className="text-2xl font-black animate-gradient">£19.99</span>
                    <span className="line-through text-gray-500 text-base font-semibold">£39.99</span>
                  </span>
                </Button>
                <p className="text-center text-gray-400 text-xs mt-4">
                  ⚡ Only 247 Copies Left • Ships Today
                </p>
              </div>
            </div>

            {/* Video Player */}
            <div className="relative group order-2 lg:order-1 max-w-xs mx-auto lg:mx-0">
              <div className="absolute -inset-8 bg-gradient-to-r from-[#f1cb32]/20 via-[#f1cb32]/10 to-transparent opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700"></div>
              <div className="relative bg-gradient-to-br from-black/80 via-black/60 to-black/80 backdrop-blur-2xl rounded-[2rem] p-3 border-2 border-[#f1cb32]/40 shadow-[0_32px_120px_rgba(241,203,50,0.3),inset_0_1px_0_0_rgba(241,203,50,0.15)] group-hover:border-[#f1cb32]/60 transition-all duration-500">
                <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 to-black shadow-inner" style={{ aspectRatio: '500/750' }}>
                  <video
                    className="w-full h-full object-cover"
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    <source src="/videos/journal-demo.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#f1cb32] opacity-20 blur-[60px] rounded-full group-hover:opacity-30 transition-opacity duration-500"></div>
              
              {/* CTA Button - Mobile Only (appears right after video) */}
              <div className="lg:hidden mt-8">
                <Button 
                  onClick={() => handleCheckout('why-works-mobile')}
                  disabled={processingButtonId === 'why-works-mobile'}
                  className="w-full relative bg-gradient-to-r from-black/90 to-black/80 backdrop-blur-xl border-2 border-[#f1cb32] hover:border-[#f1cb32]/80 hover:bg-[#f1cb32]/5 text-white font-bold py-6 rounded-2xl shadow-[0_24px_80px_rgba(241,203,50,0.4),0_0_48px_rgba(241,203,50,0.2)] hover:shadow-[0_32px_100px_rgba(241,203,50,0.6),0_0_64px_rgba(241,203,50,0.3)] transition-all duration-500 hover:scale-[1.02] text-lg group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f1cb32]/40 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="flex items-center justify-center gap-4 relative z-10">
                    <span className="text-white font-black text-xl">{processingButtonId === 'why-works-mobile' ? 'Processing...' : 'Get Started'}</span>
                    <span className="text-2xl font-black animate-gradient">£19.99</span>
                    <span className="line-through text-gray-500 text-base font-semibold">£39.99</span>
                  </span>
                </Button>
                <p className="text-center text-gray-400 text-xs mt-4">
                  🚀 Join 10,000+ People Who Started Today
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ultra-thin gold divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#f1cb32]/40 to-transparent"></div>
      
      {/* Social Proof Bar */}
      <section className="py-8 bg-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#f1cb32]/5 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex flex-wrap items-center justify-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f1cb32] to-[#d4a017] border-2 border-black flex items-center justify-center text-xs font-bold text-black shadow-[0_2px_8px_rgba(241,203,50,0.4)]">
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span className="text-gray-400 text-sm"><span className="animate-gradient font-semibold">10,000+</span> Happy Customers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#f1cb32] fill-[#f1cb32] drop-shadow-[0_2px_4px_rgba(241,203,50,0.6)]" />
                ))}
              </div>
              <span className="text-gray-400 text-sm">4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-gray-400 text-sm">Verified Reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Ultra-thin gold divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#f1cb32]/40 to-transparent"></div>
      
      {/* ⚫ Plan • Do • Achieve (How It Works) - Mobile Responsive */}
      <section id="how-it-works" className="py-24 md:py-32 lg:py-40 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#f1cb32]/5 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-20">
            <div className="inline-block bg-[#f1cb32]/10 border border-[#f1cb32]/30 rounded-full px-4 py-1 mb-6 shadow-[0_2px_8px_rgba(241,203,50,0.15)]">
              <span className="text-[#f1cb32] text-sm font-semibold">THE SYSTEM</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(255,255,255,0.1)]">HOW IT</span>{' '}
              <span className="animate-gradient drop-shadow-[0_8px_32px_rgba(241,203,50,0.6)]">WORKS</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto font-light">
              What 10,000+ people discovered about turning intention into reality
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            {[
              {
                icon: Target,
                number: '01',
                title: 'Plan',
                subtitle: 'Vision to Strategy',
                description: 'The powerful translate dreams into frameworks. The weak remain in fantasy.',
                features: ['7 Laws of Leverage', 'Strategic Categories', 'Obstacle Mapping']
              },
              {
                icon: Zap,
                number: '02',
                title: 'Do',
                subtitle: 'Action to Ritual',
                description: 'Discipline is the bridge between goals and accomplishment. Cross it daily.',
                features: ['90 Daily Rituals', 'Morning + Evening', 'Pattern Building']
              },
              {
                icon: TrendingUp,
                number: '03',
                title: 'Achieve',
                subtitle: 'Reflection to Power',
                description: 'Those who study their victories repeat them. Those who ignore their losses drown in them.',
                features: ['13 Weekly Analyses', 'Pattern Recognition', 'Strategic Refinement']
              }
            ].map((step, index) => (
              <Card key={index} className="bg-black/60 backdrop-blur-xl border-2 border-[#f1cb32]/20 p-12 md:p-14 hover:border-[#f1cb32]/40 shadow-[0_16px_64px_rgba(241,203,50,0.2),0_0_40px_rgba(241,203,50,0.1),inset_0_2px_0_0_rgba(241,203,50,0.05)] hover:shadow-[0_24px_80px_rgba(241,203,50,0.35),0_0_60px_rgba(241,203,50,0.2),inset_0_2px_0_0_rgba(241,203,50,0.1)] transition-all duration-500 group rounded-3xl hover:scale-[1.01] relative overflow-hidden">
                {/* Gold shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#f1cb32]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="space-y-6 md:space-y-8">
                  <div className="flex items-start justify-between mb-8">
                    <div className="text-5xl md:text-6xl font-black text-[#f1cb32]/30 drop-shadow-[0_4px_16px_rgba(241,203,50,0.3)] relative z-10">
                      {step.number}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-[#f1cb32]/20 to-[#f1cb32]/10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-[#f1cb32]/20 shadow-[inset_0_1px_0_0_rgba(241,203,50,0.2)] relative z-10">
                      <step.icon className="w-6 h-6" style={{color: index === 0 ? '#f87171' : index === 1 ? '#c084fc' : '#4ade80'}} />
                    </div>
                  </div>
                  
                  <div className="space-y-5 text-left">
                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-3 drop-shadow-[0_2px_8px_rgba(255,255,255,0.1)] relative z-10">{step.title}</h3>
                      <p className="text-sm font-medium animate-gradient relative z-10">{step.subtitle}</p>
                    </div>
                    
                    <p className="text-gray-400 leading-relaxed text-base relative z-10">{step.description}</p>
                    
                    <div className="space-y-3 pt-6 border-t border-[#f1cb32]/20 relative z-10">
                      {step.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                          <span className="text-sm text-gray-400">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* CTA Button */}
          <div className="text-center mt-16">
            <Button 
              onClick={() => handleCheckout('how-it-works')}
              disabled={processingButtonId === 'how-it-works'}
              className="relative bg-black/80 backdrop-blur-xl border-2 border-[#f1cb32] hover:bg-[#f1cb32]/10 text-white font-bold px-12 py-6 rounded-full shadow-[0_20px_60px_rgba(241,203,50,0.4),0_0_40px_rgba(241,203,50,0.2),inset_0_2px_0_0_rgba(241,203,50,0.1)] hover:shadow-[0_24px_80px_rgba(241,203,50,0.6),0_0_60px_rgba(241,203,50,0.3)] transition-all duration-500 hover:scale-105 text-lg group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed">
              {/* Animated gold shimmer on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f1cb32]/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>
              {/* Glossy overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="flex items-center gap-3 relative z-10">
                <span className="animate-gradient font-black">{processingButtonId === 'how-it-works' ? 'Processing...' : 'Get Started Now'}</span>
                <span className="text-xl font-black animate-gradient">£19.99</span>
                <span className="line-through opacity-60 text-gray-400 text-sm">£39.99</span>
              </span>
            </Button>
            <p className="text-center text-gray-400 text-xs mt-4">
              🔥 Limited First Edition • Secure Your Copy Now
            </p>
          </div>
        </div>
        
        {/* Premium divider below */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-yellow-500/40 to-transparent"></div>
      </section>

      {/* Ultra-thin gold divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#f1cb32]/40 to-transparent"></div>
      
      {/*  Testimonials (What People Are Saying) - Mobile Responsive */}
      <section id="testimonials" className="py-24 md:py-32 lg:py-40 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#f1cb32]/5 via-transparent to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-block bg-[#f1cb32]/10 border border-[#f1cb32]/30 rounded-full px-4 py-1 mb-6 shadow-[0_2px_8px_rgba(241,203,50,0.15)]">
              <span className="text-[#f1cb32] text-sm font-semibold">⭐ CUSTOMER REVIEWS</span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-tight">
              <span className="animate-gradient drop-shadow-[0_8px_32px_rgba(241,203,50,0.6)]">10,000+</span>{' '}
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(255,255,255,0.1)]">Transformations</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light">Power recognizes power. Results speak louder than promises.</p>
          </div>

          {/* Infinite Carousel Container */}
          <div className="relative z-10 overflow-hidden">
            <div className="flex animate-scroll">
              {/* Duplicate testimonials twice for seamless loop */}
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-6 md:gap-8 flex-shrink-0">
                  {[
                    {
                      quote: "I was stuck for years. This journal didn't just change my goals—it changed who I am. I finally became the person I knew I could be.",
                      author: "Sarah M.",
                      role: "Entrepreneur",
                      result: "Launched 2 businesses"
                    },
                    {
                      quote: "For the first time in my life, I followed through. No more excuses. No more 'tomorrow.' Just real, measurable progress every single day.",
                      author: "James P.",
                      role: "Creative Director",
                      result: "2x productivity increase"
                    },
                    {
                      quote: "I used to set goals and forget them. Now I wake up with purpose. I know exactly who I'm becoming and how to get there.",
                      author: "Maya T.",
                      role: "Founder",
                      result: "94% goal completion rate"
                    }
                  ].map((testimonial, index) => (
                    <div key={`${setIndex}-${index}`} className="relative group w-[320px] sm:w-[380px] md:w-[420px] flex-shrink-0">
                      {/* Outer glow frame */}
                      <div className="absolute -inset-1 bg-gradient-to-br from-[#f1cb32]/40 via-[#f1cb32]/20 to-transparent rounded-[2rem] opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
                      
                      {/* Card container with frame */}
                      <Card className="relative bg-gradient-to-br from-black/90 via-black/80 to-black/90 backdrop-blur-2xl border-2 border-[#f1cb32]/30 p-6 sm:p-8 md:p-10 hover:border-[#f1cb32]/50 shadow-[0_20px_80px_rgba(241,203,50,0.3),inset_0_1px_2px_rgba(241,203,50,0.15)] hover:shadow-[0_32px_120px_rgba(241,203,50,0.5),inset_0_2px_4px_rgba(241,203,50,0.25)] transition-all duration-500 rounded-[1.75rem] overflow-hidden hover:scale-[1.02]">
                        {/* Inner decorative frame */}
                        <div className="absolute inset-3 border border-[#f1cb32]/10 rounded-3xl pointer-events-none"></div>
                        
                        {/* Premium quote mark background */}
                        <div className="absolute top-8 right-8 text-7xl text-[#f1cb32]/8 font-serif leading-none">"</div>
                        
                        {/* Gold shimmer overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#f1cb32]/8 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        
                        <div className="space-y-6 relative z-10 h-full flex flex-col">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-5 h-5 text-[#f1cb32] fill-[#f1cb32] drop-shadow-[0_2px_12px_rgba(241,203,50,0.8)]" />
                            ))}
                          </div>
                          
                          <blockquote className="text-white text-lg leading-relaxed flex-grow font-medium">
                            "{testimonial.quote}"
                          </blockquote>
                          
                          <div className="space-y-4 pt-6 border-t border-[#f1cb32]/30">
                            <div className="flex items-center gap-4">
                              {/* Circular avatar with enhanced gold frame */}
                              <div className="relative flex-shrink-0">
                                <div className="absolute -inset-1.5 bg-gradient-to-br from-[#f1cb32] to-[#d4a017] rounded-full blur-md opacity-75"></div>
                                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#f1cb32] to-[#d4a017] border-2 border-[#f1cb32]/60 shadow-[0_6px_20px_rgba(241,203,50,0.5)] flex items-center justify-center">
                                  <span className="text-black font-black text-xl">{testimonial.author.charAt(0)}</span>
                                </div>
                              </div>
                              <div>
                                <div className="font-bold text-white text-lg">{testimonial.author}</div>
                                <div className="text-gray-400 text-sm">{testimonial.role}</div>
                              </div>
                            </div>
                            <div className="inline-flex items-center bg-gradient-to-r from-[#f1cb32]/15 to-[#f1cb32]/5 border border-[#f1cb32]/40 rounded-full px-5 py-2.5 shadow-[0_4px_16px_rgba(241,203,50,0.25),inset_0_1px_0_rgba(241,203,50,0.2)]">
                              <span className="text-[#f1cb32] text-sm font-bold">{testimonial.result}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center mt-16 relative z-10">
            <Button 
              onClick={() => handleCheckout('testimonials')}
              disabled={processingButtonId === 'testimonials'}
              className="relative bg-black/80 backdrop-blur-xl border-2 border-[#f1cb32] hover:bg-[#f1cb32]/10 text-white font-bold px-12 py-6 rounded-full shadow-[0_20px_60px_rgba(241,203,50,0.4),0_0_40px_rgba(241,203,50,0.2),inset_0_2px_0_0_rgba(241,203,50,0.1)] hover:shadow-[0_24px_80px_rgba(241,203,50,0.6),0_0_60px_rgba(241,203,50,0.3)] transition-all duration-500 hover:scale-105 text-lg group overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed">
              {/* Animated gold shimmer on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f1cb32]/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>
              {/* Glossy overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <span className="relative z-10 text-white">{processingButtonId === 'testimonials' ? 'Processing...' : <>Join <span className="animate-gradient font-black">10,000+</span> Happy Customers</>}</span>
            </Button>
            <p className="text-center text-gray-400 text-xs mt-4">
              ⭐ Rated 4.9/5 by 10,000+ Customers
            </p>
          </div>
        </div>
      </section>

      {/* Ultra-thin gold divider */}
      <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#f1cb32]/40 to-transparent"></div>
      
      {/* 🟨 Final CTA Section - Mobile Responsive */}
      <section className="py-32 md:py-40 bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#f1cb32]/8 via-transparent to-transparent"></div>
        {/* Gold spotlight effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#f1cb32] opacity-[0.05] blur-[100px] rounded-full"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          {/* Limited Availability Badge - Centered */}
          <div className="flex justify-center mb-12">
            <div className="inline-block bg-[#f1cb32]/10 border border-[#f1cb32]/30 rounded-full px-6 py-2.5 shadow-[0_2px_8px_rgba(241,203,50,0.15)]">
              <span className="text-[#f1cb32] text-xs font-semibold uppercase tracking-wider">Limited Availability</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-20 items-center">
            {/* Left Column - Content */}
            <div className="space-y-10">
              <div className="space-y-8">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-center">
                  <span className="block bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-[0_4px_16px_rgba(255,255,255,0.1)]">Leverage Waits</span>
                  <span className="block animate-gradient drop-shadow-[0_8px_32px_rgba(241,203,50,0.6)]">for No One</span>
                </h2>
                
                <p className="text-base md:text-lg text-gray-300 font-light">
                  <span className="animate-gradient font-semibold">10,000+</span> readers understand: clarity compounds. Consistency conquers. Structure liberates.
                </p>
              </div>
              
              <div className="space-y-6">
                {/* Premium icon badges */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-xl border border-[#f1cb32]/20 rounded-2xl px-6 py-4 hover:border-[#f1cb32]/40 transition-all duration-300 shadow-[0_8px_32px_rgba(241,203,50,0.15),inset_0_1px_0_0_rgba(241,203,50,0.05)] hover:shadow-[0_12px_48px_rgba(241,203,50,0.25)] group">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs text-gray-300">🚚 Free UK Shipping</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-xl border border-[#f1cb32]/20 rounded-2xl px-6 py-4 hover:border-[#f1cb32]/40 transition-all duration-300 shadow-[0_8px_32px_rgba(241,203,50,0.15),inset_0_1px_0_0_rgba(241,203,50,0.05)] hover:shadow-[0_12px_48px_rgba(241,203,50,0.25)] group">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs text-gray-300">✓ First Edition A5</span>
                  </div>
                  <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-xl border border-[#f1cb32]/20 rounded-2xl px-6 py-4 hover:border-[#f1cb32]/40 transition-all duration-300 shadow-[0_8px_32px_rgba(241,203,50,0.15),inset_0_1px_0_0_rgba(241,203,50,0.05)] hover:shadow-[0_12px_48px_rgba(241,203,50,0.25)] group">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 group-hover:scale-110 transition-transform duration-300" />
                    <span className="text-xs text-gray-300">✓ Daily & Weekly Structure</span>
                  </div>
                </div>

                {/* Premium shipping info */}
                <div className="bg-black/60 backdrop-blur-xl border border-[#f1cb32]/20 rounded-xl p-6 hover:border-[#f1cb32]/40 transition-all duration-300 shadow-[0_8px_32px_rgba(241,203,50,0.15),inset_0_1px_0_0_rgba(241,203,50,0.05)]">
                  <p className="text-gray-300 text-xs text-center leading-relaxed">
                    No reprints. No digital clutter. Just one powerful blueprint - on paper.
                  </p>
                </div>
              </div>

              <div>
                <Button
                  onClick={handleAddToCart}
                  size="lg"
                  className="w-full relative bg-black/80 backdrop-blur-xl border-2 border-[#f1cb32] hover:bg-[#f1cb32]/10 text-white font-bold px-16 py-8 rounded-full shadow-[0_24px_80px_rgba(241,203,50,0.5),0_0_60px_rgba(241,203,50,0.3),inset_0_2px_0_0_rgba(241,203,50,0.15)] hover:shadow-[0_32px_100px_rgba(241,203,50,0.7),0_0_80px_rgba(241,203,50,0.4)] transition-all duration-500 hover:scale-105 text-2xl group overflow-hidden"
                >
                  {/* Animated gold shimmer on hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f1cb32]/30 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-shimmer"></div>
                  {/* Glossy overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <span className="flex items-center justify-center gap-3 relative z-10">
                    <ShoppingCart className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
                    <span className="animate-gradient font-black">Add to Cart</span>
                    <span className="font-black animate-gradient">£19.99</span>
                    <span className="line-through opacity-60 text-gray-400 text-base">£39.99</span>
                  </span>
                </Button>
                <p className="text-center text-gray-400 text-xs mt-4">
                  📦 In Stock • Ships in 2–3 Business Days
                </p>
              </div>
            </div>

            {/* Right Column - Product Image */}
            <div className="hidden md:flex items-center justify-center">
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 rounded-2xl p-8 border border-[#f1cb32]/20 aspect-square w-full max-w-2xl flex items-center justify-center relative overflow-hidden">
                {/* Gold glow effect */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#f1cb32]/10 via-transparent to-transparent"></div>
                <div className="text-center space-y-4 relative z-10">
                  {/* Replace with your product image */}
                  <div className="relative w-full aspect-square max-w-[450px] mx-auto">
                    <Image 
                      src="/images/journal-product.png" 
                      alt="Leverage Journal Product"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <p className="text-gray-400 text-xl font-bold">First Edition A5</p>
                  <p className="text-gray-500 text-sm">Matte Black • Gold Foil • 222 Pages</p>
                  <div className="pt-4">
                    <div className="inline-block bg-[#f1cb32]/10 border border-[#f1cb32]/30 rounded-full px-4 py-2 shadow-[0_2px_8px_rgba(241,203,50,0.15)]">
                      <span className="animate-gradient text-sm font-semibold">⚡ Limited First Edition — Only 247 Copies Left</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⚫ Footer - Modern Clean Design */}
      <footer className="bg-black border-t border-gray-800/50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-16">
            {/* Product */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors text-sm">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors text-sm">How It Works</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors text-sm">Reviews</a></li>
                <li><a href="/pricing" className="text-gray-400 hover:text-white transition-colors text-sm">Pricing</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-3">
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors text-sm">About</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">Contact</a></li>
                <li><Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors text-sm">Dashboard</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
              <ul className="space-y-3">
                <li><a href="/help" className="text-gray-400 hover:text-white transition-colors text-sm">Help Center</a></li>
                <li><a href="/shipping" className="text-gray-400 hover:text-white transition-colors text-sm">Shipping</a></li>
                <li><a href="/returns" className="text-gray-400 hover:text-white transition-colors text-sm">Returns</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Legal</h4>
              <ul className="space-y-3">
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">Terms</a></li>
                <li><a href="/cookies" className="text-gray-400 hover:text-white transition-colors text-sm">Cookies</a></li>
              </ul>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-800/50 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              {/* Brand */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="relative w-8 h-8">
                    <Image
                      src="/images/logo.svg"
                      alt="Leverage Journal Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                  <span className="text-white font-bold text-lg">
                    <span className="animate-gradient">Leverage</span> <span className="animate-gradient">Journal</span><span className="text-transparent">™</span>
                  </span>
                </div>
                <p className="text-gray-500 text-xs max-w-xs">
                  Legacy Built. Results Engineered.
                </p>
                <p className="text-gray-500 text-xs max-w-xs">
                  &copy; 2025 Leverage Journal. All rights reserved.
                </p>
              </div>

              {/* Payment Methods - Official Logo Style */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Visa */}
                <div className="bg-white rounded px-3 py-2 h-10 flex items-center justify-center shadow-sm">
                  <span className="text-[#1A1F71] font-bold text-lg tracking-tight" style={{fontFamily: 'Arial, sans-serif'}}>visa</span>
                </div>
                {/* Mastercard */}
                <div className="bg-white rounded px-3 py-2 h-10 flex items-center justify-center shadow-sm">
                  <div className="flex items-center relative w-10">
                    <div className="w-5 h-5 rounded-full bg-[#EB001B] absolute left-0"></div>
                    <div className="w-5 h-5 rounded-full bg-[#F79E1B] absolute left-3"></div>
                  </div>
                </div>
                {/* Amex */}
                <div className="bg-[#006FCF] rounded px-3 py-2 h-10 flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm tracking-wider">AMEX</span>
                </div>
                {/* PayPal */}
                <div className="bg-white rounded px-3 py-2 h-10 flex items-center justify-center shadow-sm">
                  <div className="flex items-center gap-0.5">
                    <span className="text-[#003087] font-bold text-sm">Pay</span>
                    <span className="text-[#009CDE] font-bold text-sm">Pal</span>
                  </div>
                </div>
                {/* Apple Pay */}
                <div className="bg-black rounded px-3 py-2 h-10 flex items-center justify-center shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-white text-xl">􀣺</span>
                    <span className="text-white font-medium text-sm">Pay</span>
                  </div>
                </div>
                {/* Google Pay */}
                <div className="bg-white rounded px-3 py-2 h-10 flex items-center justify-center shadow-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-[#4285F4] font-bold text-sm">G</span>
                    <span className="text-[#5F6368] font-medium text-sm">Pay</span>
                  </div>
                </div>
                {/* Shop Pay */}
                <div className="bg-[#5A31F4] rounded px-3 py-2 h-10 flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">Shop Pay</span>
                </div>
                {/* Klarna */}
                <div className="bg-[#FFB3C7] rounded px-3 py-2 h-10 flex items-center justify-center shadow-sm">
                  <span className="text-[#0A0B09] font-bold text-sm">Klarna</span>
                </div>
              </div>
            </div>
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
    </main>
    </>
  );
}
