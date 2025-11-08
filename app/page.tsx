'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Target, TrendingUp, Zap, Star, ArrowRight, CheckCircle, User, LogOut, Clock, Trophy, Smartphone, Calendar, Shield, Truck, MessageCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import ProductMockup from '@/components/ProductMockup';

export default function Home() {
  const { user, loading, signOut } = useAuth();
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showChatWidget, setShowChatWidget] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  // Exit intent detection
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
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
      {/* Premium Preheader - Announcement Bar */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white shadow-lg backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-center space-x-6 text-sm font-medium">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse shadow-sm"></div>
              <span className="font-bold tracking-wide">🔥 LIMITED TIME OFFER</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/30"></div>
            <span className="font-semibold">50% OFF Pre-Order - Only £19.99 <span className="line-through text-red-200 ml-1">£39.99</span></span>
            <div className="hidden md:flex items-center space-x-2">
              <div className="w-px h-4 bg-white/30"></div>
              <Clock className="w-4 h-4" />
              <span className="font-medium">Ships in 2-3 weeks</span>
            </div>
            <div className="hidden lg:flex items-center space-x-2">
              <div className="w-px h-4 bg-white/30"></div>
              <Shield className="w-4 h-4" />
              <span className="font-medium">30-Day Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Navigation Header */}
      <nav className="fixed top-12 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-yellow-600/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            {/* Premium Logo */}
            <div className="flex items-center space-x-4 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-black" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 bg-clip-text text-transparent tracking-tight">
                  Leverage Journal™
                </span>
                <div className="text-xs text-gray-400 tracking-[0.2em] font-medium uppercase">90-Day Transformation</div>
              </div>
            </div>

            {/* Premium Navigation */}
            <div className="hidden md:flex items-center space-x-10">
              <a href="#how-it-works" className="relative text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium group">
                How It Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#features" className="relative text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <a href="#testimonials" className="relative text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium group">
                Reviews
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
              </a>
              <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-full px-4 py-2 backdrop-blur-sm hover:border-yellow-400/50 transition-all duration-300">
                <span className="text-yellow-400 font-bold text-sm">£19.99</span>
                <span className="text-gray-400 text-sm ml-2 line-through">£39.99</span>
              </div>
            </div>

            {/* Premium CTA Section */}
            <div className="flex items-center space-x-3">
              {!loading && (
                <>
                  {user ? (
                    <Button variant="ghost" size="sm" onClick={signOut} className="text-gray-300 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 rounded-xl">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  ) : (
                    <>
                      <Link href="/auth/signin">
                        <Button variant="ghost" className="text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all duration-300 rounded-xl font-medium">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/auth/signup">
                        <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold px-5 py-2.5 transition-all duration-300 hover:scale-105 rounded-xl shadow-lg hover:shadow-yellow-500/30">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
              <Button className="relative bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold shadow-2xl shadow-yellow-600/40 transition-all duration-300 hover:scale-105 hover:shadow-yellow-500/60 group overflow-hidden rounded-xl px-6 py-2.5">
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center space-x-2">
                  <span className="font-semibold">Pre-Order Now</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Clean Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20">
        {/* Clean, Subtle Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-600/5 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Clean Content */}
          <div className="text-center lg:text-left space-y-6">
            {/* Simple Trust Badge */}
            <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-4 py-2">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-yellow-200 text-sm font-medium">Trusted by 10,000+ achievers</span>
            </div>

            {/* Clean Emotional Headline */}
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-lg text-red-300 font-medium">
                  Tired of setting goals that never stick? 😔
                </p>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  <span className="block bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                    LEVERAGE
                  </span>
                  <span className="block bg-gradient-to-r from-yellow-300 to-yellow-200 bg-clip-text text-transparent">
                    JOURNAL™
                  </span>
                </h1>
                <div className="space-y-2">
                  <p className="text-xl text-yellow-100 font-light">Transform Your Life in 90 Days</p>
                  <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Simple Value Proposition */}
            <div>
              <p className="text-lg text-gray-100 max-w-xl leading-relaxed">
                The <span className="text-yellow-300 font-semibold">only system</span> that combines 
                psychology-backed planning with real-time app sync to turn your 
                <span className="text-yellow-300 font-semibold"> dreams into reality</span>.
              </p>
            </div>

            {/* Simple Stats */}
            <div className="grid grid-cols-3 gap-6 py-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">94%</div>
                <div className="text-sm text-gray-400">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">10K+</div>
                <div className="text-sm text-gray-400">Lives Changed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">4.9★</div>
                <div className="text-sm text-gray-400">User Rated</div>
              </div>
            </div>

            {/* Simple CTA */}
            <div className="space-y-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-base px-10 py-4 shadow-lg hover:scale-105 transition-all duration-300 w-full lg:w-auto"
              >
                <span className="flex items-center justify-center">
                  START YOUR TRANSFORMATION - £19.99
                  <ArrowRight className="ml-3 w-4 h-4" />
                </span>
              </Button>
              
              <div className="text-center lg:text-left">
                <p className="text-sm text-gray-400">
                  30-Day Money-Back Guarantee • Free Shipping • Premium App Included
                </p>
              </div>
            </div>
          </div>

          {/* Stunning Product Mockup */}
          <div className="relative hidden lg:flex items-center justify-center">
            <ProductMockup />
          </div>
        </div>
      </section>

      {/* Exit Intent Popup */}
      {showExitIntent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-neutral-900 to-black border border-yellow-600/30 rounded-3xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowExitIntent(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
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

      {/* How It Works - Enhanced */}
      <section id="how-it-works" className="py-32 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              How It <span className="text-yellow-400">Works</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Our proven 3-step system transforms your goals into reality through structured planning, consistent action, and measurable results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: Target,
                number: '01',
                title: 'Plan',
                subtitle: 'Vision to Strategy',
                description: 'Define your 90-day vision with psychology-backed frameworks. Set identity-based goals that align with who you want to become.',
                features: ['90-Day Vision Mapping', 'Identity-Based Goals', 'Psychology Frameworks']
              },
              {
                icon: Zap,
                number: '02',
                title: 'Do',
                subtitle: 'Action to Habit',
                description: 'Track daily progress with structured pages and real-time app sync. Build consistency through accountability and momentum.',
                features: ['Daily Action Tracking', 'App Sync & Reminders', 'Habit Formation']
              },
              {
                icon: TrendingUp,
                number: '03',
                title: 'Achieve',
                subtitle: 'Progress to Results',
                description: 'See measurable results as habits align with data-driven insights. Celebrate milestones and optimize your system.',
                features: ['Progress Analytics', 'System Optimization', 'Milestone Celebrations']
              }
            ].map((step, index) => (
              <Card key={index} className="bg-black/50 border border-yellow-600/20 p-8 hover:border-yellow-400/40 transition-all duration-300 group">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="text-6xl font-bold text-yellow-600/20 group-hover:text-yellow-600/40 transition-colors">
                      {step.number}
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <step.icon className="w-8 h-8 text-black" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-3xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-lg text-yellow-400 font-semibold">{step.subtitle}</p>
                    </div>
                    
                    <p className="text-gray-300 leading-relaxed">{step.description}</p>
                    
                    <div className="space-y-2 pt-4 border-t border-gray-700/50">
                      {step.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center space-x-3">
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
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Everything You <span className="text-yellow-400">Need</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Physical journal + mobile app + proven system = your transformation toolkit
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Premium Journal',
                description: '180 pages of structured planning and reflection'
              },
              {
                icon: Smartphone,
                title: 'Mobile App',
                description: 'Real-time sync, reminders, and progress tracking'
              },
              {
                icon: Calendar,
                title: '90-Day System',
                description: 'Proven framework for sustainable transformation'
              },
              {
                icon: Trophy,
                title: 'Achievement Tracking',
                description: 'Celebrate wins and optimize your progress'
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-neutral-900/50 border border-yellow-600/20 p-6 text-center hover:border-yellow-400/40 transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto">
                    <feature.icon className="w-6 h-6 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Enhanced */}
      <section id="testimonials" className="py-32 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              What People Are <span className="text-yellow-400">Saying</span>
            </h2>
            <p className="text-xl text-gray-300">Real results from real people</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                quote: "It's like having a coach, therapist, and strategist in one. The 90-day structure completely changed how I approach my goals.",
                author: "Sarah M.",
                role: "Entrepreneur",
                result: "Launched 2 businesses"
              },
              {
                quote: "My productivity doubled in 30 days. The app sync keeps me accountable even when I'm traveling.",
                author: "James P.",
                role: "Creative Director",
                result: "2x productivity increase"
              },
              {
                quote: "I finally follow through on my commitments. This system actually works where others failed.",
                author: "Maya T.",
                role: "Founder",
                result: "94% goal completion rate"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-black/50 border border-yellow-600/20 p-8 hover:border-yellow-400/40 transition-all duration-300">
                <div className="space-y-6">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <blockquote className="text-gray-100 text-lg leading-relaxed">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="space-y-2">
                    <div>
                      <div className="font-semibold text-white">{testimonial.author}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role}</div>
                    </div>
                    <div className="inline-flex items-center bg-green-500/10 border border-green-500/30 rounded-full px-3 py-1">
                      <span className="text-green-400 text-sm font-medium">{testimonial.result}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Enhanced */}
      <section className="py-32 bg-gradient-to-br from-yellow-600/20 via-yellow-500/10 to-black">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Ready to <span className="text-yellow-400">Transform</span> Your Life?
            </h2>
            
            <p className="text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
              Join 10,000+ people who've turned their ambitions into achievements with the Leverage Journal system.
            </p>
          </div>

          <div className="space-y-8">
            <Button
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-2xl px-16 py-8 shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center">
                GET YOUR LEVERAGE JOURNAL - £19.99
                <ArrowRight className="ml-4 w-8 h-8" />
              </span>
            </Button>

            <div className="space-y-4">
              <div className="text-yellow-200 font-bold text-xl">
                ⏰ Limited Time: 50% OFF (Usually £39.99)
              </div>

              <div className="flex flex-wrap justify-center gap-8 text-gray-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>30-Day Money Back Guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Free Worldwide Shipping</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span>Mobile App Included</span>
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <Clock className="w-5 h-5 text-yellow-400" />
                  <span className="text-yellow-200 font-semibold">Ships in 2-3 weeks</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Pre-order now to secure your copy. Limited first edition run.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-black border-t border-yellow-600/30 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold text-yellow-400">Leverage Journal™</span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                Transform your ambitions into achievements with our proven 90-day system.
              </p>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
                <span className="text-gray-400 text-sm ml-2">4.9/5 from 10,000+ users</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Product</h4>
              <div className="space-y-3 text-gray-400">
                <div><a href="/features" className="hover:text-yellow-400 transition-colors">Features</a></div>
                <div><a href="/how-it-works" className="hover:text-yellow-400 transition-colors">How It Works</a></div>
                <div><a href="/faq" className="hover:text-yellow-400 transition-colors">FAQ</a></div>
                <div><a href="/blog" className="hover:text-yellow-400 transition-colors">Blog</a></div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Support</h4>
              <div className="space-y-3 text-gray-400">
                <div><a href="/contact" className="hover:text-yellow-400 transition-colors">Contact</a></div>
                <div><a href="/support" className="hover:text-yellow-400 transition-colors">Help Center</a></div>
                <div><a href="/shipping" className="hover:text-yellow-400 transition-colors">Shipping</a></div>
                <div><a href="/returns" className="hover:text-yellow-400 transition-colors">Returns</a></div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Legal</h4>
              <div className="space-y-3 text-gray-400">
                <div><a href="/privacy" className="hover:text-yellow-400 transition-colors">Privacy Policy</a></div>
                <div><a href="/terms" className="hover:text-yellow-400 transition-colors">Terms of Service</a></div>
                <div><a href="/returns" className="hover:text-yellow-400 transition-colors">Return Policy</a></div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-400">
              &copy; 2024 Leverage Journal™. All rights reserved. Transform your ambitions into achievements.
            </p>
          </div>
        </div>
      </footer>

      {/* Exit Intent Popup */}
      {showExitIntent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-neutral-900 to-black border border-yellow-600/30 rounded-3xl p-8 max-w-md w-full relative">
            <button
              onClick={() => setShowExitIntent(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
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
