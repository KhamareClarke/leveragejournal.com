'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Star, CheckCircle, ArrowRight, Users, Shield, Trophy, Brain, Target } from 'lucide-react';
import Link from 'next/link';
import CountdownTimer from '@/components/CountdownTimer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Limited Edition Banner */}
      <div className="bg-red-600 text-white text-center py-3 text-sm font-medium">
        <div className="flex items-center justify-center space-x-6">
          <span className="font-bold">🔥 LIMITED EDITION</span>
          <span>Offer ends in: <CountdownTimer /></span>
          <span>Only <span className="font-bold">127/500</span> left</span>
          <span className="hidden sm:inline">✈️ FREE Worldwide Shipping</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">L</span>
              </div>
              <div>
                <div className="text-xl font-bold text-gray-900">Leverage Journal™</div>
                <div className="text-xs text-gray-500 uppercase tracking-wider">PLAN • DO • ACHIEVE</div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">How It Works</a>
              <a href="#reviews" className="text-gray-600 hover:text-blue-600 transition-colors">Reviews</a>
              <a href="/faq" className="text-gray-600 hover:text-blue-600 transition-colors">FAQ</a>
              <div className="flex items-center space-x-2">
                <span className="text-blue-600 font-bold">4.9</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-3 text-sm text-gray-600">
                <span>Sign In</span>
                <span>|</span>
                <span>Sign Up</span>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6">
                Pre-Order Now
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Social Proof Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-green-100 border border-green-200 rounded-full text-green-700 text-sm font-medium">
                <Users className="w-4 h-4 mr-2" />
                Trusted by 10,000+ High Achievers
              </div>

              {/* Main Headline */}
              <div className="space-y-6">
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  The
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Leverage</span>
                  <br />
                  Journal
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Transform your biggest goals into systematic wins with the proven 90-day achievement system.
                </p>
              </div>

              {/* Key Benefits */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-red-600 font-bold text-lg">LIMITED TIME OFFER</span>
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">50% OFF</span>
                </div>
                
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Physical Journal + App</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">AI Success Coaching</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">Psychology-Backed System</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-gray-700">30-Day Guarantee</span>
                  </div>
                </div>
              </div>

              {/* Pricing & CTA */}
              <div className="space-y-6">
                <div className="flex items-baseline space-x-4">
                  <div className="text-5xl font-bold text-blue-600">£19.99</div>
                  <div className="space-x-2">
                    <span className="line-through text-2xl text-gray-400">£39.99</span>
                    <span className="text-green-600 font-bold">Save £20!</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xl py-6 shadow-xl">
                    🚀 GET YOUR COPY NOW
                    <ArrowRight className="w-6 h-6 ml-3" />
                  </Button>
                  
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">✅ Free Shipping • ✅ 30-Day Guarantee • ✅ Instant Access</p>
                    <p className="text-xs text-red-600 font-medium">⚡ Only 127 left at this price!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Product Showcase */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">LEVERAGE JOURNAL™</h3>
                  <p className="text-blue-100">90-Day Transformation System</p>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Progress</span>
                      <span className="text-sm">Day 23/90</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full">
                      <div className="h-full w-1/4 bg-yellow-400 rounded-full"></div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-yellow-400 font-bold">94%</div>
                      <div className="text-xs text-blue-100">Success Rate</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-green-400 font-bold">8/12</div>
                      <div className="text-xs text-blue-100">Goals</div>
                    </div>
                    <div className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-orange-400 font-bold">23</div>
                      <div className="text-xs text-blue-100">Streak</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <div className="text-4xl font-bold text-blue-600">10K+</div>
                <div className="text-gray-500 text-sm">Success Stories</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600">94%</div>
                <div className="text-gray-500 text-sm">Achievement Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600">90</div>
                <div className="text-gray-500 text-sm">Days to Transform</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-500">4.9★</div>
                <div className="text-gray-500 text-sm">User Rating</div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center border-0 shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Science-Backed</h3>
              <p className="text-gray-600">Psychology + AI = Guaranteed Results</p>
            </Card>
            
            <Card className="p-6 text-center border-0 shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">90-Day System</h3>
              <p className="text-gray-600">Proven timeframe for lasting change</p>
            </Card>
            
            <Card className="p-6 text-center border-0 shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Proven Results</h3>
              <p className="text-gray-600">10,000+ successful transformations</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            What Our <span className="text-blue-600">10,000+</span> Users Say
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-3">"Doubled my productivity in 30 days!"</p>
              <p className="text-gray-500 text-sm">- Sarah M.</p>
            </Card>
            
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-3">"Finally achieved my 5-year goal!"</p>
              <p className="text-gray-500 text-sm">- James P.</p>
            </Card>
            
            <Card className="p-6 border-0 shadow-lg">
              <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 mb-3">"This system actually works!"</p>
              <p className="text-gray-500 text-sm">- Maya T.</p>
            </Card>
          </div>

          {/* Final CTA */}
          <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Life?</h3>
            <p className="text-xl text-blue-100 mb-6">Join 10,000+ high achievers who chose success</p>
            
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="text-4xl font-bold text-yellow-400">£19.99</div>
              <div className="text-blue-200 line-through text-xl">£39.99</div>
              <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold">50% OFF</div>
            </div>
            
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 font-bold text-xl py-6 px-12 mb-4">
              🚀 GET LEVERAGE JOURNAL™ NOW
            </Button>
            
            <p className="text-sm text-blue-100">✅ Free Shipping • ✅ 30-Day Guarantee • ✅ Instant Access</p>
            <p className="text-xs text-yellow-300 font-medium mt-2">⚡ Only 127 left at this price!</p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">L</span>
                </div>
                <span className="text-xl font-bold">Leverage Journal™</span>
              </div>
              <p className="text-gray-400 text-sm">
                Transform your goals into systematic success with the ultimate 90-day achievement system.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
                <li><a href="/faq" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
                <li><a href="/cookies" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="mailto:support@leveragejournal.com" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Shipping Info</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Leverage Journal™. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
