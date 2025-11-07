'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Star, CheckCircle, ArrowRight, Target, BarChart3, Smartphone, Users, Clock, Shield, Zap, Trophy, Brain, Lightbulb } from 'lucide-react';
import Link from 'next/link';
import SEOSchemas from '@/components/SEOSchemas';
import InternalLinks from '@/components/InternalLinks';
import OptimizedImage from '@/components/OptimizedImage';
import LazySection from '@/components/LazySection';

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
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-yellow-600/30">
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
                <span className="text-2xl font-bold text-yellow-400">Leverage Journal™</span>
              </div>
              
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/faq" className="text-gray-300 hover:text-yellow-400 transition-colors">
                  FAQ
                </Link>
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
          {/* Advanced Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_30%,rgba(251,191,36,0.05)_50%,transparent_70%)] animate-pulse"></div>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-600/10 rounded-full blur-3xl animate-pulse animation-delay-2000"></div>
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Column - Content */}
              <div className="space-y-10 text-center lg:text-left">
                {/* Social Proof Badge */}
                <div className="inline-flex items-center bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/40 rounded-full px-6 py-3 backdrop-blur-sm">
                  <Trophy className="w-5 h-5 text-yellow-400 mr-3" />
                  <span className="text-yellow-100 font-semibold">10,000+ Success Stories • 94% Achievement Rate</span>
                </div>

                {/* Main Headline */}
                <div className="space-y-6">
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-[0.9] tracking-tight">
                    <span className="block text-white">LEVERAGE</span>
                    <span className="block bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                      YOUR LIFE
                    </span>
                  </h1>
                  
                  <p className="text-2xl md:text-3xl text-gray-300 font-light leading-relaxed max-w-2xl">
                    The <strong className="text-yellow-400">ultimate 90-day system</strong> that transforms ambitious goals into 
                    <strong className="text-white"> guaranteed results</strong>
                  </p>
                </div>

                {/* Value Props */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Psychology-Backed</div>
                      <div className="text-gray-400 text-sm">Scientifically proven methods</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">AI-Powered</div>
                      <div className="text-gray-400 text-sm">Personalized insights</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Premium Journal</div>
                      <div className="text-gray-400 text-sm">220 structured pages</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl flex items-center justify-center">
                      <Smartphone className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <div className="text-white font-semibold">Mobile App</div>
                      <div className="text-gray-400 text-sm">Real-time sync</div>
                    </div>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="space-y-8">
                  <div className="flex items-center justify-center lg:justify-start space-x-6">
                    <div className="text-6xl font-black text-yellow-400">£19.99</div>
                    <div className="space-y-1">
                      <div className="text-3xl text-gray-500 line-through">£39.99</div>
                      <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg">50% OFF LIMITED TIME</div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-6">
                    <Link href="/dashboard" className="flex-1">
                      <Button size="lg" className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-black text-xl py-8 rounded-2xl shadow-2xl shadow-yellow-500/25 transform hover:scale-105 transition-all duration-300">
                        START YOUR TRANSFORMATION
                        <ArrowRight className="w-6 h-6 ml-3" />
                      </Button>
                    </Link>
                  </div>

                  <div className="flex items-center justify-center lg:justify-start space-x-8 text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-400" />
                      <span className="font-medium">30-Day Guarantee</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-5 h-5 text-blue-400" />
                      <span className="font-medium">10,000+ Users</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Hero Image */}
              <div className="relative lg:block hidden">
                <div className="relative w-full h-[600px] perspective-1000">
                  {/* Main Journal Mockup */}
                  <div className="absolute inset-0 transform rotate-y-12 hover:rotate-y-6 transition-transform duration-700">
                    <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-3xl shadow-2xl border border-yellow-500/20 overflow-hidden transform hover:scale-105 transition-all duration-500">
                      
                      {/* Glow Effect */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/50 via-yellow-600/50 to-yellow-500/50 rounded-3xl blur-xl opacity-60 animate-pulse"></div>
                      
                      {/* Journal Cover */}
                      <div className="relative h-full bg-gradient-to-br from-gray-900 to-black rounded-3xl p-12 flex flex-col justify-between">
                        
                        {/* Top Section */}
                        <div className="text-center space-y-6">
                          <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-yellow-500/50">
                            <Target className="w-12 h-12 text-black" />
                          </div>
                          
                          <div className="space-y-3">
                            <h2 className="text-4xl font-black bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                              LEVERAGE
                            </h2>
                            <h3 className="text-2xl font-bold text-yellow-500">JOURNAL™</h3>
                            <div className="w-32 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 mx-auto rounded-full"></div>
                            <p className="text-gray-400 font-semibold tracking-wider">90-DAY TRANSFORMATION</p>
                          </div>
                        </div>

                        {/* Progress Visualization */}
                        <div className="space-y-6">
                          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-white font-semibold">Your Progress</span>
                              <span className="text-yellow-400 font-bold">Day 23/90</span>
                            </div>
                            <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full w-1/4 bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full animate-pulse shadow-lg shadow-yellow-500/50"></div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div className="bg-yellow-500/10 backdrop-blur-sm rounded-xl p-4 text-center border border-yellow-500/20">
                              <div className="text-2xl font-black text-yellow-400">94%</div>
                              <div className="text-xs text-gray-400 font-medium">Success Rate</div>
                            </div>
                            <div className="bg-green-500/10 backdrop-blur-sm rounded-xl p-4 text-center border border-green-500/20">
                              <div className="text-2xl font-black text-green-400">8/12</div>
                              <div className="text-xs text-gray-400 font-medium">Goals Hit</div>
                            </div>
                            <div className="bg-blue-500/10 backdrop-blur-sm rounded-xl p-4 text-center border border-blue-500/20">
                              <div className="text-2xl font-black text-blue-400">23</div>
                              <div className="text-xs text-gray-400 font-medium">Day Streak</div>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Badge */}
                        <div className="text-center">
                          <div className="inline-flex items-center bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/40 rounded-full px-6 py-3 backdrop-blur-sm">
                            <Star className="w-4 h-4 text-yellow-400 mr-2" />
                            <span className="text-yellow-200 font-semibold">PREMIUM EDITION</span>
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

        {/* Features Section */}
        <LazySection className="py-20 bg-neutral-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Why <span className="text-yellow-400">It Works</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Psychology meets technology for guaranteed results.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: 'Psychology-Backed Framework',
                  description: 'Built on proven behavioral science and goal-setting research for maximum effectiveness.',
                  alt: 'Psychology-backed goal setting framework icon'
                },
                {
                  icon: Zap,
                  title: 'AI-Powered Insights',
                  description: 'Get personalized recommendations and progress analysis powered by artificial intelligence.',
                  alt: 'AI-powered insights and analytics icon'
                },
                {
                  icon: Target,
                  title: '90-Day Success System',
                  description: 'Scientifically optimal timeframe for habit formation and sustainable goal achievement.',
                  alt: '90-day achievement system target icon'
                },
                {
                  icon: Smartphone,
                  title: 'Physical + Digital Sync',
                  description: 'Premium journal paired with mobile app for seamless progress tracking anywhere.',
                  alt: 'Physical journal and mobile app synchronization icon'
                },
                {
                  icon: BarChart3,
                  title: 'Real-Time Progress Tracking',
                  description: 'Visual dashboards and analytics to keep you motivated and on track.',
                  alt: 'Real-time progress tracking and analytics icon'
                },
                {
                  icon: Trophy,
                  title: '94% Success Rate',
                  description: 'Join thousands of achievers who have transformed their goals into systematic success.',
                  alt: 'High success rate achievement trophy icon'
                }
              ].map((feature, index) => (
                <Card key={index} className="bg-neutral-800/50 border border-yellow-600/20 p-8 hover:border-yellow-400/40 transition-all duration-300 group">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </LazySection>

        {/* Testimonials Section */}
        <LazySection className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Success <span className="text-yellow-400">Stories</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Real results from real people who transformed their lives with Leverage Journal™.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: 'Sarah M.',
                  role: 'Entrepreneur',
                  content: "It's like having a coach, therapist, and strategist in one. The 90-day structure completely changed how I approach my goals.",
                  rating: 5,
                  image: '/images/testimonial-sarah.jpg'
                },
                {
                  name: 'James P.',
                  role: 'Business Executive',
                  content: 'My productivity doubled in 30 days. The app sync keeps me accountable even when I\'m traveling.',
                  rating: 5,
                  image: '/images/testimonial-james.jpg'
                },
                {
                  name: 'Maya T.',
                  role: 'Creative Director',
                  content: 'I finally follow through on my commitments. This system actually works where others failed.',
                  rating: 5,
                  image: '/images/testimonial-maya.jpg'
                }
              ].map((testimonial, index) => (
                <Card key={index} className="bg-neutral-900/50 border border-yellow-600/20 p-8">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed">"{testimonial.content}"</p>
                  <div className="flex items-center space-x-4">
                    <OptimizedImage
                      src={testimonial.image.replace('.jpg', '.svg')}
                      alt={`${testimonial.name} - Leverage Journal™ success story testimonial`}
                      width={48}
                      height={48}
                      className="rounded-full"
                    />
                    <div>
                      <div className="font-semibold text-white">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </LazySection>

        {/* CTA Section */}
        <LazySection className="py-20 bg-gradient-to-r from-yellow-600/20 to-yellow-500/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Goals?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join 10,000+ achievers who have turned their dreams into systematic success with Leverage Journal™.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <div className="text-5xl font-bold text-yellow-400">£19.99</div>
                <div className="text-gray-400">
                  <span className="line-through text-3xl">£39.99</span>
                  <span className="ml-2 bg-red-600 text-white px-3 py-1 rounded text-lg font-bold">50% OFF</span>
                </div>
              </div>
              
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-xl py-8 px-12">
                  Start Your 90-Day Journey Now
                  <ArrowRight className="w-6 h-6 ml-3" />
                </Button>
              </Link>
              
              <div className="flex items-center justify-center space-x-8 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>30-Day Money-Back Guarantee</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>10,000+ Happy Customers</span>
                </div>
              </div>
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
