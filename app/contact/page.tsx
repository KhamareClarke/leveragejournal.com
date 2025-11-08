'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, Star, ArrowRight, User, LogOut, Clock, Shield, Mail, MessageCircle, Phone, MapPin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useState } from 'react';

export default function Contact() {
  const { user, loading, signOut } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
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
              <span className="font-medium">Ships 2-3 weeks</span>
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

      {/* Contact Hero Section */}
      <section className="relative pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-900 via-black to-black"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-600/5 via-transparent to-transparent"></div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="text-center space-y-4 mb-16">
            <div className="inline-flex items-center space-x-2 bg-yellow-500/10 border border-yellow-500/30 rounded-full px-5 py-2 backdrop-blur-sm">
              <span className="text-yellow-200 text-sm font-medium">Get In Touch</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                <span className="block bg-gradient-to-r from-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                  CONTACT
                </span>
                <span className="block bg-gradient-to-r from-yellow-300 to-yellow-200 bg-clip-text text-transparent">
                  SUPPORT
                </span>
              </h1>
              
              <div className="space-y-2">
                <p className="text-lg text-yellow-100 font-light">We're Here to Help You Succeed</p>
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full mx-auto"></div>
              </div>
            </div>

            <div className="py-2">
              <p className="text-base text-gray-100 max-w-2xl leading-relaxed mx-auto">
                Have questions about your transformation journey? Need help with your order? Our dedicated support team is here to ensure your success.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card className="bg-black/50 border border-yellow-600/20 p-8 rounded-2xl">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Send Us a Message</h2>
                  <p className="text-gray-400">We'll get back to you within 24 hours</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-neutral-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-neutral-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-neutral-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-yellow-500 transition-colors"
                    >
                      <option value="">Select a topic</option>
                      <option value="order">Order Support</option>
                      <option value="product">Product Questions</option>
                      <option value="technical">Technical Support</option>
                      <option value="billing">Billing & Refunds</option>
                      <option value="partnership">Partnership Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-neutral-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold py-4 shadow-lg hover:scale-105 transition-all duration-300 rounded-xl"
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            </Card>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="grid gap-6">
                <Card className="bg-black/50 border border-yellow-600/20 p-6 rounded-2xl hover:border-yellow-400/40 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Email Support</h3>
                      <p className="text-gray-400 mb-2">Get help via email</p>
                      <a href="mailto:support@leveragejournal.com" className="text-yellow-400 hover:text-yellow-300 transition-colors">
                        support@leveragejournal.com
                      </a>
                    </div>
                  </div>
                </Card>

                <Card className="bg-black/50 border border-yellow-600/20 p-6 rounded-2xl hover:border-yellow-400/40 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MessageCircle className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Live Chat</h3>
                      <p className="text-gray-400 mb-2">Chat with our team</p>
                      <p className="text-yellow-400">Available 9 AM - 6 PM GMT</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-black/50 border border-yellow-600/20 p-6 rounded-2xl hover:border-yellow-400/40 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Phone Support</h3>
                      <p className="text-gray-400 mb-2">Speak with our team</p>
                      <p className="text-yellow-400">+44 20 7946 0958</p>
                    </div>
                  </div>
                </Card>

                <Card className="bg-black/50 border border-yellow-600/20 p-6 rounded-2xl hover:border-yellow-400/40 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white mb-2">Office Address</h3>
                      <p className="text-gray-400 mb-2">Visit our headquarters</p>
                      <p className="text-yellow-400">
                        123 Transformation Street<br />
                        London, UK SW1A 1AA
                      </p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Quick Links */}
              <Card className="bg-gradient-to-br from-yellow-600/10 via-yellow-500/5 to-transparent border border-yellow-600/20 p-6 rounded-2xl">
                <h3 className="text-lg font-bold text-white mb-4">Quick Help</h3>
                <div className="space-y-3">
                  <Link href="/faq" className="block text-yellow-400 hover:text-yellow-300 transition-colors">
                    → Frequently Asked Questions
                  </Link>
                  <Link href="/shipping" className="block text-yellow-400 hover:text-yellow-300 transition-colors">
                    → Shipping Information
                  </Link>
                  <Link href="/returns" className="block text-yellow-400 hover:text-yellow-300 transition-colors">
                    → Returns & Refunds
                  </Link>
                  <Link href="/support" className="block text-yellow-400 hover:text-yellow-300 transition-colors">
                    → Help Center
                  </Link>
                </div>
              </Card>
            </div>
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
  );
}
