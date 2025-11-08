'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, CheckCircle, ArrowRight, Users, Shield, Trophy, Brain, Target } from 'lucide-react';
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Limited Edition Banner */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 text-black text-center py-3 text-sm font-medium">
        <div className="flex items-center justify-center space-x-6">
          <span className="font-bold">🔥 LIMITED EDITION</span>
          <span>Offer ends in: <CountdownTimer /></span>
          <span>Only <span className="font-bold">127/500</span> left</span>
          <span className="hidden sm:inline">✈️ FREE Worldwide Shipping</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-black border-b border-yellow-600/30 sticky top-0 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-lg">L</span>
              </div>
              <div>
                <div className="text-xl font-bold text-yellow-400">Leverage Journal™</div>
                <div className="text-xs text-gray-400 uppercase tracking-wider">PLAN • DO • ACHIEVE</div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-yellow-400 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-300 hover:text-yellow-400 transition-colors">How It Works</a>
              <a href="#reviews" className="text-gray-300 hover:text-yellow-400 transition-colors">Reviews</a>
              <a href="/faq" className="text-gray-300 hover:text-yellow-400 transition-colors">FAQ</a>
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400 font-bold">4.9</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 text-sm text-gray-300">
                <span>Sign In</span>
                <span>|</span>
                <span>Sign Up</span>
              </div>
              <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-semibold px-6">
                Pre-Order Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-600/5 via-transparent to-yellow-500/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Social Proof Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-yellow-600/20 border border-yellow-600/30 rounded-full text-yellow-400 text-sm font-medium">
                <Users className="w-4 h-4 mr-2" />
                Trusted by 10,000+ High Achievers
              </div>

              {/* Main Headline */}
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                  The
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600"> Leverage</span>
                  <br />
                  Journal
                </h1>
                <p className="text-xl text-gray-300 leading-relaxed">
                  Transform your biggest goals into systematic wins with the proven 90-day achievement system.
                </p>
              </div>

              {/* Key Benefits */}
              <div className="bg-gradient-to-r from-yellow-600/10 to-yellow-500/10 border border-yellow-600/20 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-yellow-400 font-bold text-lg">LIMITED TIME OFFER</span>
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">50% OFF</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">Physical Journal + App</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">AI Success Coaching</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">Psychology-Backed System</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-white">30-Day Guarantee</span>
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
                  <Button size="lg" className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-xl py-6 shadow-xl shadow-yellow-500/25">
                    🚀 GET YOUR COPY NOW
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-400 mb-2">✅ Free Shipping • ✅ 30-Day Guarantee • ✅ Instant Access</p>
                    <p className="text-xs text-red-400 font-medium">⚡ Only 127 left at this price!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Product Showcase */}
            <div className="relative">
              <div className="bg-gradient-to-br from-yellow-600 to-yellow-500 rounded-3xl p-8 text-black shadow-2xl shadow-yellow-500/25">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">LEVERAGE JOURNAL™</h3>
                  <p className="text-yellow-900">90-Day Transformation System</p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-black/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm font-medium">Day 23/90</span>
                    </div>
                    <div className="h-2 bg-black/20 rounded-full">
                      <div className="h-full w-1/4 bg-black rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-black/10 rounded-lg p-3 text-center">
                      <div className="text-black font-bold">94%</div>
                      <div className="text-xs text-yellow-900">Success Rate</div>
                    </div>
                    <div className="bg-black/10 rounded-lg p-3 text-center">
                      <div className="text-black font-bold">8/12</div>
                      <div className="text-xs text-yellow-900">Goals</div>
                    </div>
                    <div className="bg-black/10 rounded-lg p-3 text-center">
                      <div className="text-black font-bold">23</div>
                      <div className="text-xs text-yellow-900">Streak</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-neutral-900/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
                <div className="text-4xl font-bold text-yellow-400">4.9★</div>
                <div className="text-gray-400 text-sm">User Rating</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center bg-neutral-800/50 border border-yellow-600/20 shadow-lg">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Science-Backed</h3>
              <p className="text-gray-300">Psychology + AI = Guaranteed Results</p>
            </Card>
            
            <Card className="p-6 text-center bg-neutral-800/50 border border-yellow-600/20 shadow-lg">
              <div className="w-12 h-12 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">90-Day System</h3>
              <p className="text-gray-300">Proven timeframe for lasting change</p>
            </Card>
            
            <Card className="p-6 text-center bg-neutral-800/50 border border-yellow-600/20 shadow-lg">
              <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Proven Results</h3>
              <p className="text-gray-300">10,000+ successful transformations</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            What Our <span className="text-yellow-400">10,000+</span> Users Say
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 bg-neutral-900/50 border border-yellow-600/20 shadow-lg">
              <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-3">"Doubled my productivity in 30 days!"</p>
              <p className="text-gray-500 text-sm">- Sarah M.</p>
            </Card>
            
            <Card className="p-6 bg-neutral-900/50 border border-yellow-600/20 shadow-lg">
              <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-3">"Finally achieved my 5-year goal!"</p>
              <p className="text-gray-500 text-sm">- James P.</p>
            </Card>
            
            <Card className="p-6 bg-neutral-900/50 border border-yellow-600/20 shadow-lg">
              <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-300 mb-3">"This system actually works!"</p>
              <p className="text-gray-500 text-sm">- Maya T.</p>
            </Card>
          </div>

          {/* Final CTA */}
          <Card className="p-8 bg-gradient-to-r from-yellow-600 to-yellow-500 text-black border-0 shadow-2xl shadow-yellow-500/25">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Life?</h3>
            <p className="text-xl text-yellow-900 mb-6">Join 10,000+ high achievers who chose success</p>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="text-4xl font-bold text-black">£19.99</div>
              <div className="text-yellow-800 line-through text-xl">£39.99</div>
              <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">50% OFF</div>
            </div>
            
            <Button size="lg" className="bg-black text-yellow-400 hover:bg-gray-900 font-bold text-xl py-6 px-12 mb-4">
              🚀 GET LEVERAGE JOURNAL™ NOW
            </Button>
            
            <p className="text-sm text-yellow-900">✅ Free Shipping • ✅ 30-Day Guarantee • ✅ Instant Access</p>
            <p className="text-xs text-red-600 font-medium mt-2">⚡ Only 127 left at this price!</p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 border-t border-yellow-600/20 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                  <span className="text-black font-bold">L</span>
                </div>
                <span className="text-xl font-bold text-yellow-400">Leverage Journal™</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transform your goals into systematic success with the ultimate 90-day achievement system.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-yellow-400">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-yellow-400">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-yellow-400">How It Works</a></li>
                <li><a href="/faq" className="hover:text-yellow-400">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-yellow-400">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/privacy" className="hover:text-yellow-400">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-yellow-400">Terms of Service</a></li>
                <li><a href="/cookies" className="hover:text-yellow-400">Cookie Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-yellow-400">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="mailto:support@leveragejournal.com" className="hover:text-yellow-400">Contact Us</a></li>
                <li><a href="#" className="hover:text-yellow-400">Help Center</a></li>
                <li><a href="#" className="hover:text-yellow-400">Shipping Info</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-yellow-600/20 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Leverage Journal™. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
