'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Star, CheckCircle, ArrowRight, Target, BarChart3, Smartphone, Users, Clock, Shield, Zap, Trophy, Brain, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import SEOSchemas from '@/components/SEOSchemas';
import InternalLinks from '@/components/InternalLinks';
import OptimizedImage from '@/components/OptimizedImage';
import LazySection from '@/components/LazySection';
import CountdownTimer from '@/components/CountdownTimer';

export default function HomePage() {
  const productData = {
    name: 'Leverage Journal™ - Ultimate 90-Day Achievement System',
    price: '19.99',
    currency: 'GBP',
    availability: 'InStock',
    rating: 4.9,
    reviewCount: 10000
  };

  return (
    <>
      {/* SEO Schema for Homepage */}
      <SEOSchemas page="home" productData={productData} />
      
      <div className="min-h-screen bg-black text-white">
        {/* Limited Edition Banner */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white text-center py-2 text-sm font-medium">
          <div className="flex items-center justify-center space-x-4">
            <span className="font-bold">LIMITED EDITION</span>
            <span>Offer ends in: <CountdownTimer /></span>
            <span>Only <span className="font-bold">127/500</span> left</span>
            <span className="hidden sm:inline">FREE Worldwide Shipping</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="fixed top-10 left-0 right-0 z-40 bg-black/95 backdrop-blur-xl border-b border-yellow-600/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <OptimizedImage
                  src="/images/logo.svg"
                  alt="Leverage Journal™ Logo - Ultimate 90-Day Achievement System"
                  width={40}
                  height={40}
                  priority={true}
                  className="rounded-lg"
                />
                <div>
                  <div className="text-2xl font-bold text-yellow-400">Leverage Journal™</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">PLAN • DO • ACHIEVE</div>
                </div>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-300 hover:text-yellow-400 transition-colors">Features</a>
                <a href="#how-it-works" className="text-gray-300 hover:text-yellow-400 transition-colors">How It Works</a>
                <a href="#reviews" className="text-gray-300 hover:text-yellow-400 transition-colors">Reviews</a>
                <a href="/faq" className="text-gray-300 hover:text-yellow-400 transition-colors">FAQ</a>
                <div className="flex items-center space-x-2">
                  <span className="text-yellow-400 font-bold">4.9/5</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-2 text-sm">
                  <span className="text-gray-400">Sign In</span>
                  <span className="text-gray-400">|</span>
                  <span className="text-gray-400">Sign Up</span>
                </div>
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-black font-semibold">
                  Pre-Order Now
                </Button>
              </div>
              
              <Button className="md:hidden bg-yellow-600 hover:bg-yellow-700 text-black">
                Menu
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="hero-section relative pt-32 pb-16 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/5 via-transparent to-yellow-500/5"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-600/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-yellow-500/15 rounded-full blur-2xl animate-pulse animation-delay-2000"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh]">
              {/* Left Column - Content */}
              <div className="space-y-8">
                {/* Social Proof Badge */}
                <div className="inline-flex items-center px-4 py-2 bg-green-600/20 border border-green-600/30 rounded-full text-green-400 text-sm font-medium">
                  <Users className="w-4 h-4 mr-2" />
                  Join 10,000+ High Achievers
                </div>

                {/* Power Headline */}
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                    <span className="text-white">The</span>
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">Leverage</span>
                    <br />
                    <span className="text-white">Journal</span>
                  </h1>
                  <p className="text-2xl text-gray-300 font-medium max-w-2xl">
                    The proven system that turns your biggest goals into inevitable wins.
                  </p>
                </div>

                {/* Urgency + Benefits */}
                <div className="bg-gradient-to-r from-yellow-600/10 to-yellow-500/10 border border-yellow-600/20 rounded-xl p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-bold text-lg">LIMITED TIME OFFER</span>
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">50% OFF</span>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white font-medium">Physical Journal + App</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white font-medium">AI Success Coaching</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white font-medium">Psychology-Backed System</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                      <span className="text-white font-medium">Money-Back Guarantee</span>
                    </div>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="space-y-6">
                  <div className="flex items-baseline space-x-4">
                    <div className="text-5xl font-bold text-yellow-400">£19.99</div>
                    <div className="space-x-2">
                      <span className="line-through text-2xl text-gray-500">£39.99</span>
                      <span className="text-green-400 font-bold">Save £20!</span>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Link href="/dashboard" className="block">
                      <Button size="lg" className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-xl py-8 shadow-2xl shadow-yellow-500/25">
                        CLAIM YOUR COPY NOW
                        <ArrowRight className="w-6 h-6 ml-3" />
                      </Button>
                    </Link>
                    
                    <div className="text-center">
                      <p className="text-sm text-gray-400 mb-2">Instant Access • Free Shipping • 30-Day Guarantee</p>
                      <p className="text-xs text-red-400 font-medium">Only 127 copies left at this price!</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Product Showcase */}
              <div className="relative hidden lg:flex items-center justify-center">
                {/* Floating Elements Background */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-yellow-600/10 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-yellow-500/15 rounded-full blur-xl animate-pulse animation-delay-1000"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-yellow-400/5 rounded-full blur-3xl"></div>
                </div>

                <div className="relative flex items-center space-x-8">
                  {/* Premium Journal Mockup */}
                  <div className="relative group">
                    <div className="absolute -inset-4 bg-gradient-to-r from-yellow-600/30 via-yellow-500/20 to-yellow-600/30 rounded-3xl blur-2xl opacity-60 group-hover:opacity-80 transition-all duration-500"></div>
                    <div className="relative w-72 h-96 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black rounded-3xl border border-yellow-600/40 shadow-2xl shadow-black/50 group-hover:scale-105 transition-all duration-500 overflow-hidden">
                      {/* Book Cover Design */}
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/10 to-transparent"></div>
                      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
                      
                      <div className="p-8 h-full flex flex-col justify-between">
                        {/* Header */}
                        <div className="text-center space-y-4">
                          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-yellow-600/30">
                            <BookOpen className="w-10 h-10 text-black" />
                          </div>
                          <div>
                            <h3 className="text-3xl font-bold bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent mb-2">LEVERAGE</h3>
                            <h4 className="text-xl font-semibold text-yellow-500">JOURNAL™</h4>
                            <div className="w-24 h-0.5 bg-gradient-to-r from-yellow-500 to-yellow-600 mx-auto my-3"></div>
                            <p className="text-sm text-gray-400 font-medium">90-DAY TRANSFORMATION</p>
                          </div>
                        </div>

                        {/* Progress Visualization */}
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex justify-between text-xs text-gray-400">
                              <span>Progress</span>
                              <span>Day 23/90</span>
                            </div>
                            <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                              <div className="h-full w-1/4 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full animate-pulse"></div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-yellow-500/10 rounded-lg p-2">
                              <div className="text-yellow-400 font-bold text-sm">94%</div>
                              <div className="text-xs text-gray-500">Success</div>
                            </div>
                            <div className="bg-green-500/10 rounded-lg p-2">
                              <div className="text-green-400 font-bold text-sm">8/12</div>
                              <div className="text-xs text-gray-500">Goals</div>
                            </div>
                            <div className="bg-orange-500/10 rounded-lg p-2">
                              <div className="text-orange-400 font-bold text-sm">23</div>
                              <div className="text-xs text-gray-500">Streak</div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Badge */}
                        <div className="text-center">
                          <div className="inline-flex items-center bg-yellow-500/20 border border-yellow-500/30 rounded-full px-3 py-1">
                            <Star className="w-3 h-3 text-yellow-400 mr-1" />
                            <span className="text-yellow-200 text-xs font-medium">Premium Edition</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mobile App Mockup */}
                  <div className="relative group">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-600/20 via-purple-500/15 to-blue-600/20 rounded-3xl blur-xl opacity-50 group-hover:opacity-70 transition-all duration-500"></div>
                    <div className="relative w-48 h-96 bg-gradient-to-br from-neutral-900 via-neutral-800 to-black rounded-3xl border border-gray-600/40 shadow-xl shadow-black/30 group-hover:scale-105 transition-all duration-500 overflow-hidden">
                      {/* Phone Frame */}
                      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gray-600 rounded-full"></div>
                      
                      {/* App Interface */}
                      <div className="pt-8 p-4 h-full">
                        {/* App Header */}
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                              <Smartphone className="w-4 h-4 text-black" />
                            </div>
                            <div>
                              <div className="text-white text-sm font-semibold">Leverage</div>
                              <div className="text-gray-400 text-xs">Day 23</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-400 text-xs">Synced</span>
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-3 mb-6">
                          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3">
                            <div className="text-blue-400 text-lg font-bold">8</div>
                            <div className="text-gray-400 text-xs">Goals Active</div>
                          </div>
                          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                            <div className="text-orange-400 text-lg font-bold">23</div>
                            <div className="text-gray-400 text-xs">Day Streak</div>
                          </div>
                        </div>

                        {/* Today's Focus */}
                        <div className="space-y-3">
                          <div className="text-white text-sm font-medium">Today's Focus</div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-3 bg-yellow-500/10 rounded-lg p-2">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                              <span className="text-gray-300 text-xs">Complete morning routine</span>
                            </div>
                            <div className="flex items-center space-x-3 bg-green-500/10 rounded-lg p-2">
                              <CheckCircle className="w-3 h-3 text-green-400" />
                              <span className="text-gray-400 text-xs line-through">Review weekly goals</span>
                            </div>
                            <div className="flex items-center space-x-3 bg-blue-500/10 rounded-lg p-2">
                              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                              <span className="text-gray-300 text-xs">Plan tomorrow's priorities</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof + Features */}
        <LazySection className="py-16 bg-neutral-900/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Social Proof Numbers */}
            <div className="text-center mb-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-4xl font-bold text-yellow-400">10K+</div>
                  <div className="text-gray-400 text-sm">Success Stories</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-green-400">94%</div>
                  <div className="text-gray-400 text-sm">Achievement Rate</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-blue-400">90</div>
                  <div className="text-gray-400 text-sm">Days to Transform</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-purple-400">4.9★</div>
                  <div className="text-gray-400 text-sm">User Rating</div>
                </div>
              </div>
            </div>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-yellow-600/10 to-yellow-500/5 border border-yellow-600/20 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Science-Backed</h3>
                <p className="text-gray-300">Psychology + AI = Guaranteed Results</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-600/10 to-green-500/5 border border-green-600/20 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Physical + Digital</h3>
                <p className="text-gray-300">Journal + App = Perfect Sync</p>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600/10 to-blue-500/5 border border-blue-600/20 rounded-xl p-6 text-center">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-6 h-6 text-black" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Proven System</h3>
                <p className="text-gray-300">90 Days = Life Transformation</p>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-red-600/20 to-red-500/10 border border-red-600/30 rounded-xl p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-white mb-4">⚠️ WARNING: Price Increases Tomorrow!</h3>
                <p className="text-gray-300 mb-6">Join 10,000+ high achievers before the price goes back to £39.99</p>
                <Link href="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-lg px-12 py-4">
                    🔥 SECURE YOUR COPY - £19.99
                  </Button>
                </Link>
                <p className="text-xs text-gray-400 mt-3">💯 30-Day Money-Back Guarantee • 🚚 Free Worldwide Shipping</p>
              </div>
            </div>
          </div>
        </LazySection>

        {/* Quick Testimonials + Final CTA */}
        <LazySection className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              What Our <span className="text-yellow-400">10,000+</span> Users Say
            </h2>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-neutral-900/50 border border-yellow-600/20 rounded-xl p-6">
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm mb-3">"Doubled my productivity in 30 days!"</p>
                <p className="text-gray-500 text-xs">- Sarah M.</p>
              </div>
              
              <div className="bg-neutral-900/50 border border-yellow-600/20 rounded-xl p-6">
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm mb-3">"Finally achieved my 5-year goal!"</p>
                <p className="text-gray-500 text-xs">- James P.</p>
              </div>
              
              <div className="bg-neutral-900/50 border border-yellow-600/20 rounded-xl p-6">
                <div className="flex justify-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm mb-3">"This system actually works!"</p>
                <p className="text-gray-500 text-xs">- Maya T.</p>
              </div>
            </div>

            {/* Final CTA */}
            <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-500/10 border border-yellow-600/30 rounded-2xl p-8">
              <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Life?</h3>
              <p className="text-xl text-gray-300 mb-6">Join 10,000+ high achievers who chose success</p>
              
              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="text-4xl font-bold text-yellow-400">£19.99</div>
                <div className="text-gray-500 line-through text-xl">£39.99</div>
                <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">50% OFF</div>
              </div>
              
              <Link href="/dashboard" className="block max-w-md mx-auto">
                <Button size="lg" className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-xl py-6 mb-4">
                  🚀 GET LEVERAGE JOURNAL™ NOW
                </Button>
              </Link>
              
              <p className="text-sm text-gray-400">✅ Free Shipping • ✅ 30-Day Guarantee • ✅ Instant Access</p>
              <p className="text-xs text-red-400 font-medium mt-2">⚡ Only 127 left at this price!</p>
            </div>
          </div>
        </LazySection>


        {/* Internal Links */}
        <LazySection>
          <InternalLinks 
            currentPage="/"
            category="product"
            title="Learn More About Leverage Journal™"
            description="Discover everything you need to know about our 90-day achievement system"
            maxItems={6}
          />
        </LazySection>

        {/* Footer */}
        <footer className="bg-neutral-900 border-t border-yellow-600/20 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <OptimizedImage
                    src="/images/logo.svg"
                    alt="Leverage Journal™ Logo"
                    width={32}
                    height={32}
                    className="rounded-lg"
                  />
                  <span className="text-xl font-bold text-yellow-400">Leverage Journal™</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Transform your goals into systematic success with the ultimate 90-day achievement system.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">Product</h4>
                <div className="space-y-2">
                  <Link href="/how-it-works" className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    How It Works
                  </Link>
                  <Link href="/features" className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    Features
                  </Link>
                  <Link href="/dashboard" className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    Dashboard
                  </Link>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">Support</h4>
                <div className="space-y-2">
                  <Link href="/faq" className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    FAQ
                  </Link>
                  <Link href="/contact" className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    Contact
                  </Link>
                  <a href="mailto:support@leveragejournal.com" className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    support@leveragejournal.com
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-white mb-4">Legal</h4>
                <div className="space-y-2">
                  <Link href="/privacy" className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    Privacy Policy
                  </Link>
                  <Link href="/terms" className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    Terms of Service
                  </Link>
                  <Link href="/cookies" className="block text-gray-400 hover:text-yellow-400 transition-colors text-sm">
                    Cookie Policy
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 mt-8 pt-8 text-center">
              <p className="text-gray-400 text-sm">
                © 2025 Leverage Journal™. All rights reserved. Made with ❤️ for achievers worldwide.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
