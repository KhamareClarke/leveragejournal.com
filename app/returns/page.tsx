'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Star, ArrowRight, User, LogOut, Clock, Shield, RotateCcw, Package, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Returns() {
  const { user, loading, signOut } = useAuth();

  return (
    <>
      <head>
        <title>Returns & Refunds - Leverage Journal™ | 30-Day Money-Back Guarantee</title>
        <meta name="description" content="Easy returns and 30-day money-back guarantee for Leverage Journal. Learn about our hassle-free return process and refund policy." />
        <meta name="keywords" content="returns, refunds, money back guarantee, Leverage Journal, return policy" />
        <meta property="og:title" content="Returns & Refunds - Leverage Journal™" />
        <meta property="og:description" content="30-day money-back guarantee and easy return process for our 90-day transformation system." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://leveragejournal.com/returns" />
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

        {/* Returns Hero Section */}
        <section className="relative pt-32 pb-20">
          <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-600/5 via-transparent to-transparent"></div>
          
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="text-center space-y-4 mb-16">
              <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-5 py-2 backdrop-blur-sm">
                <RotateCcw className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-200 text-sm font-medium">Returns & Refunds</span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                  <span className="block bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                    30-DAY
                  </span>
                  <span className="block bg-gradient-to-r from-yellow-300 to-yellow-200 bg-clip-text text-transparent">
                    GUARANTEE
                  </span>
                </h1>
                
                <div className="space-y-2">
                  <p className="text-lg text-yellow-100 font-light">Risk-Free Transformation</p>
                  <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mx-auto"></div>
                </div>
              </div>

              <div className="py-2">
                <p className="text-base text-gray-100 max-w-2xl leading-relaxed mx-auto">
                  We're so confident in the Leverage Journal system that we offer a <span className="text-yellow-300 font-semibold">30-day money-back guarantee</span>. 
                  If you're not completely satisfied, we'll refund your purchase, no questions asked.
                </p>
              </div>
            </div>

            {/* Guarantee Highlights */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Card className="bg-gradient-to-br from-green-600/10 via-green-500/5 to-transparent border border-green-600/20 p-6 text-center hover:border-green-400/40 transition-all duration-300 rounded-2xl">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">30-Day Guarantee</h3>
                    <p className="text-gray-300">Full refund within 30 days of purchase, no questions asked</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-blue-600/10 via-blue-500/5 to-transparent border border-blue-600/20 p-6 text-center hover:border-blue-400/40 transition-all duration-300 rounded-2xl">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                    <RotateCcw className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Easy Returns</h3>
                    <p className="text-gray-300">Simple return process with prepaid shipping labels</p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-purple-600/10 via-purple-500/5 to-transparent border border-purple-600/20 p-6 text-center hover:border-purple-400/40 transition-all duration-300 rounded-2xl">
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Fast Processing</h3>
                    <p className="text-gray-300">Refunds processed within 5-7 business days</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Return Process */}
            <div className="grid lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">How to Return Your Order</h2>
                <div className="space-y-6">
                  <Card className="bg-black/50 border border-yellow-600/20 p-6 rounded-2xl">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 text-black font-bold text-sm">
                        1
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">Contact Support</h3>
                        <p className="text-gray-400">Email us at returns@leveragejournal.com or use our contact form to initiate your return request.</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-black/50 border border-yellow-600/20 p-6 rounded-2xl">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 text-black font-bold text-sm">
                        2
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">Receive Return Label</h3>
                        <p className="text-gray-400">We'll email you a prepaid return shipping label within 24 hours of your request.</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-black/50 border border-yellow-600/20 p-6 rounded-2xl">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 text-black font-bold text-sm">
                        3
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">Package & Ship</h3>
                        <p className="text-gray-400">Pack your journal in its original packaging and attach the return label. Drop it off at any post office.</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-black/50 border border-yellow-600/20 p-6 rounded-2xl">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 text-black font-bold text-sm">
                        4
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">Get Your Refund</h3>
                        <p className="text-gray-400">Once we receive your return, we'll process your refund within 5-7 business days to your original payment method.</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Return Policy Details */}
              <div>
                <h2 className="text-2xl font-bold text-white mb-6">Return Policy Details</h2>
                <div className="space-y-6">
                  <Card className="bg-black/50 border border-yellow-600/20 p-6 rounded-2xl">
                    <div className="flex items-start space-x-4">
                      <Package className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">Condition Requirements</h3>
                        <ul className="text-gray-400 space-y-1 text-sm">
                          <li>• Journal must be in original condition</li>
                          <li>• Original packaging preferred but not required</li>
                          <li>• Light use and writing is acceptable</li>
                          <li>• Damaged items will still be accepted</li>
                        </ul>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-black/50 border border-yellow-600/20 p-6 rounded-2xl">
                    <div className="flex items-start space-x-4">
                      <Clock className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">Time Limits</h3>
                        <ul className="text-gray-400 space-y-1 text-sm">
                          <li>• 30 days from delivery date</li>
                          <li>• Return request must be initiated within this period</li>
                          <li>• Shipping time back to us doesn't count against limit</li>
                          <li>• Extensions available for special circumstances</li>
                        </ul>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-black/50 border border-yellow-600/20 p-6 rounded-2xl">
                    <div className="flex items-start space-x-4">
                      <CheckCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="text-lg font-bold text-white mb-2">What's Included</h3>
                        <ul className="text-gray-400 space-y-1 text-sm">
                          <li>• Full purchase price refunded</li>
                          <li>• Original shipping costs refunded</li>
                          <li>• Return shipping is free (we provide label)</li>
                          <li>• Digital app access revoked upon refund</li>
                        </ul>
                      </div>
                    </div>
                  </Card>

                  <Card className="bg-gradient-to-br from-yellow-600/10 via-yellow-500/5 to-transparent border border-yellow-600/20 p-6 rounded-2xl">
                    <h3 className="text-lg font-bold text-white mb-2">Need Help?</h3>
                    <p className="text-gray-300 mb-4">Our customer support team is here to make your return as smooth as possible.</p>
                    <div className="space-y-2 text-sm text-gray-400">
                      <p><strong>Email:</strong> returns@leveragejournal.com</p>
                      <p><strong>Phone:</strong> +44 20 7946 0958</p>
                      <p><strong>Hours:</strong> Mon-Fri 9 AM - 6 PM GMT</p>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-16">
              <Card className="bg-gradient-to-br from-yellow-600/10 via-yellow-500/5 to-transparent border border-yellow-600/20 p-8 rounded-2xl max-w-2xl mx-auto">
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-white">Ready to Transform Risk-Free?</h2>
                  <p className="text-gray-300">Try the Leverage Journal system with complete confidence. Your satisfaction is guaranteed.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold px-8 py-3 shadow-lg hover:scale-105 transition-all duration-300 rounded-xl">
                      Start Your Transformation - £19.99
                    </Button>
                    <Link href="/contact">
                      <Button variant="outline" className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10 px-8 py-3">
                        Contact Support
                      </Button>
                    </Link>
                  </div>
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
