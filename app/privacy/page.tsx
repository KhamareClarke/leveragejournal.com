'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Star, ArrowRight, User, LogOut, Clock, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Privacy() {
  const { user, loading, signOut } = useAuth();

  return (
    <>
      <head>
        <title>Privacy Policy - Leverage Journal™ | 90-Day Transformation System</title>
        <meta name="description" content="Learn how Leverage Journal protects your privacy and personal data. Our comprehensive privacy policy explains data collection, usage, and your rights." />
        <meta name="keywords" content="privacy policy, data protection, personal information, Leverage Journal, goal setting privacy" />
        <meta property="og:title" content="Privacy Policy - Leverage Journal™" />
        <meta property="og:description" content="Learn how we protect your privacy and personal data in our 90-day transformation system." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://leveragejournal.com/privacy" />
      </head>

      <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
        {/* Top Red Strip */}
        <div className="fixed top-0 left-0 right-0 z-[60] bg-gradient-to-r from-red-600 via-red-500 to-red-600 text-white shadow-lg backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 text-xs font-medium">
              <div className="flex items-center space-x-1 bg-white/10 rounded-full px-3 py-1 backdrop-blur-sm">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                <span className="font-bold">🔥 LIMITED TIME</span>
              </div>
              <div className="flex items-center space-x-1 bg-white/10 rounded-full px-3 py-1 backdrop-blur-sm">
                <span className="font-semibold">50% OFF - £19.99</span>
                <span className="line-through text-red-200 text-xs">£39.99</span>
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

        {/* Navigation Header */}
        <nav className="fixed top-8 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-yellow-600/20 shadow-2xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-5">
              <div className="flex items-center space-x-4 group">
                <Link href="/">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform duration-300">
                      <BookOpen className="w-6 h-6 text-black" />
                    </div>
                  </div>
                </Link>
                <div>
                  <Link href="/">
                    <span className="text-2xl font-bold bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 bg-clip-text text-transparent tracking-tight">
                      Leverage Journal™
                    </span>
                  </Link>
                  <div className="text-xs text-gray-400 tracking-[0.2em] font-medium uppercase">90-Day Transformation</div>
                </div>
              </div>

              <div className="hidden md:flex items-center space-x-10">
                <a href="/#how-it-works" className="relative text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium group">
                  How It Works
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
                </a>
                <Link href="/features" className="relative text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium group">
                  Features
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link href="/faq" className="relative text-gray-300 hover:text-yellow-400 transition-all duration-300 font-medium group">
                  FAQ
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-yellow-400 to-yellow-600 group-hover:w-full transition-all duration-300"></span>
                </Link>
                <div className="bg-gradient-to-r from-yellow-500/10 to-yellow-600/10 border border-yellow-500/30 rounded-full px-4 py-2 backdrop-blur-sm hover:border-yellow-400/50 transition-all duration-300">
                  <span className="text-yellow-400 font-bold text-sm">£19.99</span>
                  <span className="text-gray-400 text-sm ml-2 line-through">£39.99</span>
                </div>
              </div>

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

        {/* Privacy Policy Content */}
        <section className="relative pt-32 pb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black"></div>
          
          <div className="max-w-4xl mx-auto px-4 relative z-10">
            <div className="text-center space-y-4 mb-16">
              <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-5 py-2 backdrop-blur-sm">
                <Shield className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-200 text-sm font-medium">Privacy Policy</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                <span className="block bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                  PRIVACY
                </span>
                <span className="block bg-gradient-to-r from-yellow-300 to-yellow-200 bg-clip-text text-transparent">
                  POLICY
                </span>
              </h1>
              
              <p className="text-lg text-yellow-100 font-light">Your Privacy Matters to Us</p>
              <p className="text-base text-gray-300">Last Updated: November 8, 2024</p>
            </div>

            <div className="prose prose-invert prose-yellow max-w-none">
              <Card className="bg-black/50 border border-yellow-600/20 p-8 rounded-2xl mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
                <p className="text-gray-300 leading-relaxed">
                  At Leverage Journal™, we are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, mobile application, and services.
                </p>
              </Card>

              <Card className="bg-black/50 border border-yellow-600/20 p-8 rounded-2xl mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-2">Personal Information</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Name and contact information (email address, phone number)</li>
                      <li>Billing and shipping addresses</li>
                      <li>Payment information (processed securely through third-party providers)</li>
                      <li>Account credentials and preferences</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-yellow-400 mb-2">Usage Information</h3>
                    <ul className="list-disc list-inside space-y-2">
                      <li>Journal entries and goal-setting data (stored locally and encrypted)</li>
                      <li>App usage patterns and preferences</li>
                      <li>Device information and technical data</li>
                      <li>Website interaction and analytics data</li>
                    </ul>
                  </div>
                </div>
              </Card>

              <Card className="bg-black/50 border border-yellow-600/20 p-8 rounded-2xl mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>To provide and improve our products and services</li>
                  <li>To process orders and manage your account</li>
                  <li>To send important updates and customer support</li>
                  <li>To personalize your experience and provide relevant content</li>
                  <li>To analyze usage patterns and improve our offerings</li>
                  <li>To comply with legal obligations and protect our rights</li>
                </ul>
              </Card>

              <Card className="bg-black/50 border border-yellow-600/20 p-8 rounded-2xl mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We implement industry-standard security measures to protect your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>End-to-end encryption for sensitive data</li>
                  <li>Secure SSL connections for all data transmission</li>
                  <li>Regular security audits and updates</li>
                  <li>Limited access to personal information on a need-to-know basis</li>
                  <li>Secure data centers with physical and digital protection</li>
                </ul>
              </Card>

              <Card className="bg-black/50 border border-yellow-600/20 p-8 rounded-2xl mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  You have the following rights regarding your personal information:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                  <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                  <li><strong>Portability:</strong> Receive your data in a structured format</li>
                  <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
                </ul>
              </Card>

              <Card className="bg-black/50 border border-yellow-600/20 p-8 rounded-2xl mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  We use cookies and similar technologies to enhance your experience:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>Essential cookies for website functionality</li>
                  <li>Analytics cookies to understand usage patterns</li>
                  <li>Preference cookies to remember your settings</li>
                  <li>Marketing cookies for relevant advertising (with your consent)</li>
                </ul>
                <p className="text-gray-300 leading-relaxed mt-4">
                  You can manage cookie preferences through your browser settings or our cookie consent tool.
                </p>
              </Card>

              <Card className="bg-black/50 border border-yellow-600/20 p-8 rounded-2xl mb-8">
                <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
                <p className="text-gray-300 leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="space-y-2 text-gray-300">
                  <p><strong>Email:</strong> privacy@leveragejournal.com</p>
                  <p><strong>Address:</strong> 123 Transformation Street, London, UK SW1A 1AA</p>
                  <p><strong>Phone:</strong> +44 20 7946 0958</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t border-yellow-600/30 py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-16 mb-16">
              <div className="space-y-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg">
                    <BookOpen className="w-6 h-6 text-black" />
                  </div>
                  <span className="text-xl font-bold text-yellow-400">Leverage Journal™</span>
                </div>
                <p className="text-gray-400 leading-relaxed text-base">
                  Transform your ambitions into achievements with our proven 90-day system.
                </p>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="text-gray-400 text-sm ml-2">4.9/5 from 10,000+ users</span>
                </div>
                
                <Link href="/dashboard">
                  <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-all duration-300">
                    <User className="w-4 h-4 mr-2" />
                    📘 Login to Dashboard
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-white mb-8 text-lg">Product</h4>
                <div className="space-y-4 text-gray-400">
                  <div><Link href="/features" className="hover:text-yellow-400 transition-colors font-medium">Features</Link></div>
                  <div><a href="/#how-it-works" className="hover:text-yellow-400 transition-colors font-medium">How It Works</a></div>
                  <div><Link href="/faq" className="hover:text-yellow-400 transition-colors font-medium">FAQ</Link></div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-white mb-8 text-lg">Support</h4>
                <div className="space-y-4 text-gray-400">
                  <div><Link href="/contact" className="hover:text-yellow-400 transition-colors font-medium">Contact</Link></div>
                  <div><Link href="/support" className="hover:text-yellow-400 transition-colors font-medium">Help Center</Link></div>
                  <div><Link href="/shipping" className="hover:text-yellow-400 transition-colors font-medium">Shipping</Link></div>
                  <div><Link href="/returns" className="hover:text-yellow-400 transition-colors font-medium">Returns</Link></div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-bold text-white mb-8 text-lg">Legal</h4>
                <div className="space-y-4 text-gray-400">
                  <div><Link href="/privacy" className="hover:text-yellow-400 transition-colors font-medium">Privacy Policy</Link></div>
                  <div><Link href="/terms" className="hover:text-yellow-400 transition-colors font-medium">Terms of Service</Link></div>
                  <div><Link href="/returns" className="hover:text-yellow-400 transition-colors font-medium">Return Policy</Link></div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-12 text-center">
              <p className="text-gray-400 text-base">
                &copy; 2024 Leverage Journal™. All rights reserved. Transform your ambitions into achievements.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
